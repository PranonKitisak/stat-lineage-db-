// chat-worker/src/index.js
export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.activeAirdrops = new Map(); // Track active airdrops with quota
  }

  async fetch(request) {
    const url = new URL(request.url);
    
    // Validate WebSocket upgrade
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const { 0: client, 1: server } = new WebSocketPair();
    
    const sessionData = { 
      userId: url.searchParams.get("userId"), 
      role: url.searchParams.get("role") 
    };
    
    server.serializeAttachment(sessionData);
    this.state.acceptWebSocket(server);

    this.broadcast(JSON.stringify({ type: 'presence', userId: sessionData.userId, status: 'online' }));
    this.broadcast(JSON.stringify({ type: 'online_count', count: this.state.getWebSockets().length }));

    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }

  async webSocketMessage(ws, message) {
    const session = ws.deserializeAttachment() || {};
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'chat') {
        if (data.roomId === 'global') {
          if (session.role !== 'admin') {
            const config = await this.env.DB.prepare("SELECT value FROM config WHERE key = 'global_chat_enabled'").first();
            if (config && config.value === 'false') {
              try { ws.send(JSON.stringify({ type: 'system', message: { text: '❌ แชทโลกถูกปิดใช้งานชั่วคราวโดยแอดมิน' } })); } catch (e) {}
              return;
            }
          }
          const result = await this.env.DB.prepare(
            "INSERT INTO global_messages (sender_id, sender_name, sender_role, text, timestamp) VALUES (?, ?, ?, ?, ?)"
          ).bind(data.message.senderId, data.message.senderName, data.message.senderRole, data.message.text, data.message.timestamp).run();
          data.message.id = result.meta.last_row_id;
        } else if (data.roomId.startsWith('buddy_')) {
          const result = await this.env.DB.prepare(
            "INSERT INTO buddy_messages (room_id, sender_id, sender_name, sender_role, text, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
          ).bind(data.roomId, data.message.senderId, data.message.senderName, data.message.senderRole, data.message.text, data.message.timestamp).run();
          data.message.id = result.meta.last_row_id;
        } else {
          const result = await this.env.DB.prepare(
            "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
          ).bind(data.roomId, data.message.senderId, data.message.senderName, data.message.senderRole, data.message.text, data.message.timestamp).run();
          data.message.id = result.meta.last_row_id;
        }

        this.broadcast(JSON.stringify({ type: 'chat', message: data.message }));

        if (data.message.senderId) {
          const user = await this.env.DB.prepare("SELECT global_message_count, lineage_message_count, stars FROM users WHERE id = ?").bind(data.message.senderId).first();
          if (user) {
            let newStars = user.stars || 0;
            let questCompleted = false;
            let missionName = "";

            if (data.roomId === 'global') {
              const newCount = (user.global_message_count || 0) + 1;
              if (newCount === 5) { newStars += 1; questCompleted = true; missionName = "แชทโลก"; }
              await this.env.DB.prepare("UPDATE users SET global_message_count = ?, stars = ? WHERE id = ?").bind(newCount, newStars, data.message.senderId).run();
            } else {
              const newCount = (user.lineage_message_count || 0) + 1;
              if (newCount === 5) { newStars += 1; questCompleted = true; missionName = "แชทสายรหัส"; }
              await this.env.DB.prepare("UPDATE users SET lineage_message_count = ?, stars = ? WHERE id = ?").bind(newCount, newStars, data.message.senderId).run();
            }

            if (questCompleted) {
              try { ws.send(JSON.stringify({ type: 'system', message: { text: `🌟 ยินดีด้วย! คุณทำภารกิจส่งข้อความครบ 5 ข้อความใน${missionName} ได้รับ 1 ดาว!` } })); } catch (e) {}
            }
          }
        }
        
      } else if (data.type === 'typing') {
        this.broadcast(JSON.stringify({ type: 'typing', userId: session.userId, isTyping: data.isTyping }), ws);
        
      } else if (data.type === 'read_receipt') {
        if (data.messageId) {
          await this.env.DB.prepare("UPDATE messages SET is_read = 1 WHERE id = ?").bind(data.messageId).run();
        }
        this.broadcast(JSON.stringify({ type: 'read_receipt', messageId: data.messageId, readBy: session.userId }), ws);
        
      } else if (data.type === 'reaction') {
        this.broadcast(JSON.stringify({ type: 'reaction', emoji: data.emoji, userId: session.userId }));
      } else if (data.type === 'admin_config') {
        if (session.role !== 'admin') return;
        this.broadcast(JSON.stringify({ type: 'admin_config', key: data.key, value: data.value }));
      } else if (data.type === 'admin_update_stars') {
        if (session.role !== 'admin') return;
        this.broadcast(JSON.stringify({ type: 'admin_update_stars', userId: data.userId, stars: data.stars, name: data.name }));
      } else if (data.type === 'admin_bulk_action') {
        if (session.role !== 'admin') return;
        // Broadcast bulk action to all connected clients
        this.broadcast(JSON.stringify({ type: 'admin_bulk_action', action: data.action, value: data.value }));
      } else if (data.type === 'admin_airdrop') {
        if (session.role !== 'admin') return;
        if (session.userId) {
          const user = await this.env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(session.userId).first();
          if (!user || user.role !== 'admin') {
            try { ws.send(JSON.stringify({ type: 'system', message: { text: "⚠️ You are not authorized." } })); } catch (e) {}
            return;
          }
        } else return;

        const airdrop = {
          id: data.airdropId, starsPerPerson: data.starsPerPerson, maxClaimers: data.maxClaimers,
          remainingSlots: data.maxClaimers, claimedBy: new Set()
        };
        this.activeAirdrops.set(data.airdropId, airdrop);

        this.broadcast(JSON.stringify({ type: 'admin_airdrop', airdropId: data.airdropId, starsPerPerson: data.starsPerPerson, maxClaimers: data.maxClaimers, remainingSlots: data.maxClaimers }));

      } else if (data.type === 'airdrop') {
        const airdropId = data.airdropId;
        const airdrop = airdropId ? this.activeAirdrops.get(airdropId) : null;

        if (airdrop) {
          if (airdrop.remainingSlots <= 0) {
            try { ws.send(JSON.stringify({ type: 'system', message: { text: "❌ Airdrop หมดแล้ว! ไม่มีช่องว่างเหลือ" } })); } catch (e) {}
            return;
          }

          if (airdrop.claimedBy.has(session.userId)) {
            try { ws.send(JSON.stringify({ type: 'system', message: { text: "⚠️ คุณรับ Airdrop นี้ไปแล้ว!" } })); } catch (e) {}
            return;
          }

          airdrop.remainingSlots -= 1;
          airdrop.claimedBy.add(session.userId);

          await this.env.DB.prepare("UPDATE users SET stars = stars + ? WHERE id = ?").bind(airdrop.starsPerPerson, session.userId).run();
          const historyId = crypto.randomUUID();
          await this.env.DB.prepare("INSERT INTO star_history (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(historyId, session.userId, airdrop.starsPerPerson, "รับรางวัล Airdrop").run();

          this.broadcast(JSON.stringify({ type: 'airdrop_claimed', airdropId: airdropId, userId: session.userId, userName: data.userName, starsAmount: airdrop.starsPerPerson, remainingSlots: airdrop.remainingSlots }));

          if (airdrop.remainingSlots <= 0) {
            this.broadcast(JSON.stringify({ type: 'airdrop_expired', airdropId: airdropId }));
            this.activeAirdrops.delete(airdropId);
          }
        } else {
          this.broadcast(JSON.stringify({ type: 'airdrop_claimed', userId: session.userId, userName: data.userName }));
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  }

  async webSocketClose(ws, code, reason, wasClean) {
    const session = ws.deserializeAttachment() || {};
    this.broadcast(JSON.stringify({ type: 'presence', userId: session.userId, status: 'offline' }));
    this.broadcast(JSON.stringify({ type: 'online_count', count: this.state.getWebSockets().length }));
  }

  async webSocketError(ws, error) {
    const session = ws.deserializeAttachment() || {};
    this.broadcast(JSON.stringify({ type: 'presence', userId: session.userId, status: 'offline' }));
    this.broadcast(JSON.stringify({ type: 'online_count', count: this.state.getWebSockets().length }));
  }

  broadcast(msg, excludeWs = null) {
    const websockets = this.state.getWebSockets();
    websockets.forEach(ws => {
      if (ws !== excludeWs) {
        try { ws.send(msg); } catch (e) {}
      }
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    const roomId = url.searchParams.get("roomId");
    if (!roomId) {
      return new Response("Missing roomId", { status: 400 });
    }

    const id = env.CHAT_ROOM.idFromName(roomId);
    const stub = env.CHAT_ROOM.get(id);

    return stub.fetch(request);
  }
};
