// functions/api/lineages.js
// API สำหรับดึงข้อมูลสายรหัสทั้งหมด หรืออัปเดตสถานะเฉลย

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "ฐานข้อมูล D1 ไม่ได้เชื่อมต่อ" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  // GET METHOD
  if (request.method === "GET") {
    try {
      // 1. ดึงข้อมูลรายละเอียดของสายรหัสตัวเดียว (ถ้ามีระบุ ID)
      if (id) {
        const lineageResult = await env.DB.prepare(
          "SELECT * FROM lineages WHERE id = ?"
        )
        .bind(id)
        .first();

        if (!lineageResult) {
          return new Response(JSON.stringify({ error: "ไม่พบสายรหัสนี้" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }

        const seniorResult = await env.DB.prepare(
          "SELECT * FROM users WHERE lineage_id = ? AND role = 'senior'"
        )
        .bind(id)
        .first();

        const juniorsResults = await env.DB.prepare(
          "SELECT * FROM users WHERE lineage_id = ? AND role = 'junior' ORDER BY id ASC"
        )
        .bind(id)
        .all();

        const hintsResults = await env.DB.prepare(
          "SELECT hint_text FROM hints WHERE lineage_id = ? ORDER BY id ASC"
        )
        .bind(id)
        .all();
        const hints = hintsResults.results.map(h => h.hint_text);

        const chatResults = await env.DB.prepare(
          "SELECT * FROM messages WHERE lineage_id = ? ORDER BY id ASC"
        )
        .bind(id)
        .all();

        const lineageInfo = {
          id: lineageResult.id,
          revealed: lineageResult.revealed === 1,
          specialHint: lineageResult.special_hint,
          hints: hints,
          senior: seniorResult ? {
            id: seniorResult.id,
            email: seniorResult.email,
            name: seniorResult.name,
            major: seniorResult.major,
            avatar: seniorResult.avatar,
            stars: seniorResult.stars,
            loginStreak: seniorResult.login_streak,
            globalName: seniorResult.global_name,
            globalMessageCount: seniorResult.global_message_count,
            lineageMessageCount: seniorResult.lineage_message_count
          } : null,
          juniors: juniorsResults.results.map(j => ({
            id: j.id,
            email: j.email,
            name: j.name,
            major: j.major,
            ig: j.ig,
            avatar: j.avatar,
            stars: j.stars,
            loginStreak: j.login_streak,
            globalName: j.global_name,
            globalMessageCount: j.global_message_count,
            lineageMessageCount: j.lineage_message_count,
            photoUrl: j.photo_url || "",
            favorites: j.favorites || ""
          })),
          messages: chatResults.results.map(m => ({
            id: m.id,
            senderId: m.sender_id,
            senderName: m.sender_name,
            senderRole: m.sender_role,
            text: m.text,
            timestamp: m.timestamp,
            isRead: !!m.is_read
          }))
        };

        return new Response(JSON.stringify(lineageInfo), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // 2. ดึงข้อมูลรายชื่อสายรหัสทั้งหมด (รวม hints และ messages เพื่อให้ sync สมบูรณ์)
      // ออปติไมซ์: ลด N+1 Queries โดยดึงข้อมูลทั้งหมดมาไว้ในหน่วยความจำแล้วจัดกลุ่ม
      const [lineagesResult, usersResult, hintsResult, chatResult] = await env.DB.batch([
        env.DB.prepare("SELECT * FROM lineages ORDER BY id ASC"),
        env.DB.prepare("SELECT * FROM users"),
        env.DB.prepare("SELECT * FROM hints ORDER BY id ASC"),
        env.DB.prepare("SELECT * FROM messages ORDER BY id ASC")
      ]);
      
      const lineages = lineagesResult.results;
      const allUsers = usersResult.results;
      const allHints = hintsResult.results;
      const allMessages = chatResult.results;

      // จัดกลุ่มข้อมูล
      const usersByLineage = {};
      allUsers.forEach(u => {
        if (!usersByLineage[u.lineage_id]) usersByLineage[u.lineage_id] = { senior: null, juniors: [] };
        if (u.role === 'senior') {
          usersByLineage[u.lineage_id].senior = u;
        } else if (u.role === 'junior') {
          usersByLineage[u.lineage_id].juniors.push(u);
        }
      });

      const hintsByLineage = {};
      allHints.forEach(h => {
        if (!hintsByLineage[h.lineage_id]) hintsByLineage[h.lineage_id] = [];
        hintsByLineage[h.lineage_id].push(h.hint_text);
      });

      const messagesByLineage = {};
      allMessages.forEach(m => {
        if (!messagesByLineage[m.lineage_id]) messagesByLineage[m.lineage_id] = [];
        messagesByLineage[m.lineage_id].push({
          id: m.id,
          senderId: m.sender_id,
          senderName: m.sender_name,
          senderRole: m.sender_role,
          text: m.text,
          timestamp: m.timestamp,
          isRead: !!m.is_read
        });
      });

      const detailedLineages = lineages.map(lin => {
        const usersGroup = usersByLineage[lin.id] || { senior: null, juniors: [] };
        const senior = usersGroup.senior;
        const juniors = usersGroup.juniors;
        const hints = hintsByLineage[lin.id] || [];
        const messages = messagesByLineage[lin.id] || [];

        return {
          id: lin.id,
          revealed: lin.revealed === 1,
          specialHint: lin.special_hint,
          hints: hints,
          senior: senior ? {
            id: senior.id,
            email: senior.email,
            name: (url.searchParams.get('role') === 'junior' && lin.revealed === 0) ? undefined : senior.name,
            major: (url.searchParams.get('role') === 'junior' && lin.revealed === 0) ? undefined : senior.major,
            avatar: senior.avatar,
            stars: senior.stars,
            loginStreak: senior.login_streak,
            globalName: senior.global_name,
            globalMessageCount: senior.global_message_count,
            lineageMessageCount: senior.lineage_message_count
          } : null,
          juniors: juniors.map(j => ({
            id: j.id,
            email: j.email,
            name: j.name,
            major: j.major,
            ig: j.ig,
            avatar: j.avatar,
            stars: j.stars,
            loginStreak: j.login_streak,
            globalName: j.global_name,
            globalMessageCount: j.global_message_count,
            lineageMessageCount: j.lineage_message_count,
            photoUrl: j.photo_url || "",
            favorites: j.favorites || ""
          })),
          messages: messages
        };
      });

      return new Response(JSON.stringify(detailedLineages), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // POST METHOD - จัดการเฉลย/ซ่อนตัวตนทีละสายรหัส (แอดมิน)
  if (request.method === "POST") {
    try {
      const { lineageId, revealed, adminId } = await request.json();
      
      const adminUser = await env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(adminId).first();
      if (!adminUser || adminUser.role !== 'admin') {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
      }

      await env.DB.prepare(
        "UPDATE lineages SET revealed = ? WHERE id = ?"
      )
      .bind(revealed ? 1 : 0, lineageId)
      .run();

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
