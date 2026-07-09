// app_ws.js - WebSocket Connections (Global Chat + Lineage Chat)
let globalWs = null;
let lineageWs = null;
let typingTimeout = null;
let lineageTypingTimeout = null;
let leaderboardInterval = null;

window.updateGlobalChatLockState = function() {
  const input = document.getElementById('global-chat-input');
  const btn = document.getElementById('global-send-btn');
  if (!input || !btn) return;
  
  if (currentSession.role !== 'admin' && currentSession.config && currentSession.config.globalChatEnabled === false) {
    input.disabled = true;
    input.placeholder = "แชทโลกถูกปิดใช้งานชั่วคราวโดยแอดมิน...";
    btn.disabled = true;
  } else {
    input.disabled = false;
    input.placeholder = "พิมพ์ข้อความในแชทโลก...";
    btn.disabled = false;
  }
};
// ==============================================
// NAVIGATION (สลับหน้า Dashboard / Global Chat)
// ==============================================
function navigateTo(page) {
  const dashboard = document.getElementById('dashboard-section');
  const globalchat = document.getElementById('globalchat-section');
  const buddySection = document.getElementById('buddy-section');
  
  const navDash = document.getElementById('nav-dashboard-btn');
  const navChat = document.getElementById('nav-globalchat-btn');
  const navBuddy = document.getElementById('nav-buddy-btn');
  
  // รีเซ็ตทุกหน้า
  if (dashboard) dashboard.style.display = 'none';
  if (globalchat) globalchat.style.display = 'none';
  if (buddySection) buddySection.style.display = 'none';
  if (navDash) navDash.classList.remove('active');
  if (navChat) navChat.classList.remove('active');
  if (navBuddy) navBuddy.classList.remove('active');

  if (page === 'globalchat') {
    if (globalchat) globalchat.style.display = 'block';
    if (navChat) navChat.classList.add('active');
    updateGlobalChatLockState();
    connectGlobalWebSocket();
    fetchGlobalMessages();
    fetchLeaderboard();
    if (leaderboardInterval) clearInterval(leaderboardInterval);
    leaderboardInterval = setInterval(fetchLeaderboard, 30000); // 30s polling
    updateMissionBar();
    
    if (currentSession && currentSession.role === 'admin') {
      const airdropControls = document.getElementById('admin-airdrop-controls');
      if (airdropControls) airdropControls.style.display = 'block';
    } else {
      const airdropControls = document.getElementById('admin-airdrop-controls');
      if (airdropControls) airdropControls.style.display = 'none';
    }
  } else if (page === 'buddy') {
    if (buddySection) buddySection.style.display = 'block';
    if (navBuddy) navBuddy.classList.add('active');
    if (leaderboardInterval) {
      clearInterval(leaderboardInterval);
      leaderboardInterval = null;
    }
    if (typeof window.loadBuddyData === 'function') {
      window.loadBuddyData();
    }
  } else {
    if (dashboard) dashboard.style.display = 'block';
    if (navDash) navDash.classList.add('active');
    if (leaderboardInterval) {
      clearInterval(leaderboardInterval);
      leaderboardInterval = null;
    }
  }
}

// ==============================================
// GLOBAL CHAT WebSocket
// ==============================================
function connectGlobalWebSocket() {
  if (globalWs && globalWs.readyState === WebSocket.OPEN) return;
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const userId = currentSession.user.id;
  const role = currentSession.role;
  globalWs = new WebSocket(`${wsProtocol}//${window.location.host}/api/ws-chat?roomId=global&userId=${userId}&role=${role}`);
  
  globalWs.onopen = () => {
    const chatInput = document.getElementById('global-chat-input');
    const sendBtn = document.getElementById('global-send-btn');
    const isGlobalChatEnabled = (currentSession.config && currentSession.config.globalChatEnabled !== false);
    
    if (chatInput) chatInput.disabled = !isGlobalChatEnabled;
    if (sendBtn) sendBtn.disabled = !isGlobalChatEnabled;
    
    // ตั้ง placeholder ตามชื่อสมมติ
    const displayName = currentSession.role === 'admin' ? 'Admin' : (currentSession.user.globalName || 'ไม่ระบุ');
    if (chatInput) {
      if (!isGlobalChatEnabled && currentSession.role !== 'admin') {
        chatInput.placeholder = `🔒 แชทโลกถูกปิดใช้งานชั่วคราว`;
      } else {
        chatInput.placeholder = `พิมพ์ข้อความในแชทโลก (คุณคือ: ${displayName})...`;
      }
    }
  };
  
  globalWs.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'chat') {
        appendGlobalMessage(data.message);
      } else if (data.type === 'typing') {
        showGlobalTyping(data.userId, data.isTyping);
      } else if (data.type === 'online_count') {
        const el = document.getElementById('global-online-count');
        if (el) el.innerText = `🟢 ออนไลน์ ${data.count} คน`;
      } else if (data.type === 'reaction') {
        showFloatingReaction(data.emoji);
      } else if (data.type === 'admin_airdrop') {
        showAirdropOffer(data);
      } else if (data.type === 'airdrop_claimed') {
        showAirdropClaim(data);
      } else if (data.type === 'airdrop_expired') {
        hideAirdropOffer(data.airdropId);
      } else if (data.type === 'system') {
        appendSystemMessage(data.message.text);
        // อัปเดตดาวหลังจากทำภารกิจสำเร็จ
        if (data.message.text.includes('ได้รับ')) {
          currentSession.user.stars = (currentSession.user.stars || 0) + 1;
          document.getElementById('star-count-val').innerText = currentSession.user.stars;
          sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
        }
      } else if (data.type === 'admin_config') {
        if (!currentSession.config) currentSession.config = {};
        const isTrue = data.value === 'true' || data.value === true;
        currentSession.config[data.key] = isTrue;
        
        if (data.key === 'global_chat_enabled') {
          currentSession.config.globalChatEnabled = isTrue;
          updateGlobalChatLockState();
        } else if (data.key === 'guessing_enabled') {
          currentSession.config.guessingEnabled = isTrue;
        } else if (data.key === 'admin_allow_special_hint') {
          currentSession.config.adminAllowSpecialHint = isTrue;
        }
        sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      } else if (data.type === 'admin_update_stars') {
        if (currentSession && currentSession.user && currentSession.user.id === data.userId) {
          currentSession.user.stars = data.stars;
          document.getElementById('star-count-val').innerText = currentSession.user.stars;
          sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
        }
        // Force refresh leaderboard
        fetchLeaderboard();
      } else if (data.type === 'admin_bulk_action') {
        // เมื่อมีการ bulk action ให้อัปเดตข้อมูลสายรหัสใหม่ทันที
        if (typeof syncWithServer === 'function') {
          syncWithServer().then(() => {
            if (currentSession && typeof getLineages === 'function') {
              const updatedLineages = getLineages();
              const myLin = updatedLineages.find(l => l.id === currentSession.lineage.id);
              if (myLin) {
                currentSession.lineage = myLin;
                sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
              }
            }

            if (currentSession && currentSession.role === 'junior') {
              const cardInner = document.getElementById('reveal-card-inner');
            if (data.action === 'reveal_lineages') {
              if (data.value) {
                if (cardInner && !cardInner.classList.contains('flipped')) {
                  cardInner.classList.add('flipped');
                  if (typeof startConfetti === 'function') startConfetti();
                }
              } else {
                if (cardInner && cardInner.classList.contains('flipped')) {
                  cardInner.classList.remove('flipped');
                }
              }
              if (typeof renderJuniorSeniorCardDetails === 'function') renderJuniorSeniorCardDetails();
            } else if (data.action === 'reveal_special_hints') {
              if (typeof renderJuniorHints === 'function') renderJuniorHints();
            }
          } else if (currentSession && currentSession.role === 'senior') {
            if (typeof renderSeniorHints === 'function') renderSeniorHints();
          }
        });
        } // End if syncWithServer
      }
    } catch (e) {}
  };
  
  globalWs.onclose = () => {
    globalWs = null;
    setTimeout(connectGlobalWebSocket, 5000);
  };
}

// ==============================================
// LINEAGE CHAT WebSocket
// ==============================================
function connectLineageWebSocket() {
  if (lineageWs) {
    lineageWs.close();
    lineageWs = null;
  }
  
  if (!currentSession || !currentSession.lineage) return;
  
  let roomId = `lineage_${currentSession.lineage.id}`; // Default group
  if (activeLineageRoom && activeLineageRoom !== 'group') {
    if (currentSession.role === 'junior') {
      roomId = `lineage_private_${currentSession.lineage.id}_${currentSession.user.id}`;
    } else if (currentSession.role === 'senior') {
      roomId = `lineage_private_${currentSession.lineage.id}_${activeLineageRoom}`;
    }
  }
  
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  lineageWs = new WebSocket(`${wsProtocol}//${window.location.host}/api/ws-chat?roomId=${roomId}&userId=${currentSession.user.id}&role=${currentSession.role}`);
  
  lineageWs.onopen = () => {
    console.log('Lineage WS connected to room:', roomId);
  };
  
  lineageWs.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'chat') {
        const msg = data.message;
        appendLineageMessage(msg.senderName, msg.text, msg.senderId === currentSession.user.id, msg.timestamp, msg.senderRole);
      } else if (data.type === 'typing') {
        showLineageTyping(data.userId, data.isTyping);
      } else if (data.type === 'admin_config') {
        if (!currentSession.config) currentSession.config = {};
        const isTrue = data.value === 'true' || data.value === true;
        currentSession.config[data.key] = isTrue;
        
        if (data.key === 'global_chat_enabled') {
          currentSession.config.globalChatEnabled = isTrue;
          updateGlobalChatLockState();
        } else if (data.key === 'guessing_enabled') {
          currentSession.config.guessingEnabled = isTrue;
        } else if (data.key === 'admin_allow_special_hint') {
          currentSession.config.adminAllowSpecialHint = isTrue;
        }
        sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      }
    } catch (e) {}
  };
  
  lineageWs.onclose = () => {
    lineageWs = null;
    // Reconnect only if session still active
    if (currentSession && currentSession.lineage) {
      setTimeout(connectLineageWebSocket, 5000);
    }
  };
  
  // Load message history from backend
  fetchRoomMessages(roomId);
}

// ส่งข้อความผ่าน WebSocket (แทนที่ API polling)
function sendLineageMessage(text) {
  if (!lineageWs || lineageWs.readyState !== WebSocket.OPEN) return false;
  
  let roomId = `lineage_${currentSession.lineage.id}`;
  if (activeLineageRoom !== 'group') {
    if (currentSession.role === 'junior') {
      roomId = `lineage_private_${currentSession.lineage.id}_${currentSession.user.id}`;
    } else if (currentSession.role === 'senior') {
      roomId = `lineage_private_${currentSession.lineage.id}_${activeLineageRoom}`;
    }
  }
  
  const msg = {
    id: 'temp_' + Date.now(), 
    senderId: currentSession.user.id,
    senderName: currentSession.user.name,
    senderRole: currentSession.role,
    text: text,
    timestamp: new Date().toISOString()
  };
  
  lineageWs.send(JSON.stringify({
    type: 'chat',
    roomId: roomId,
    message: msg
  }));
  
  // อัปเดต Mission Bar สายรหัส
  if (currentSession.role !== 'admin') {
    currentSession.user.lineageMessageCount = (currentSession.user.lineageMessageCount || 0) + 1;
    updateLineageMissionBar();
  }
  
  sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
  
  return true;
}

// Lineage typing indicator
function sendLineageTyping(isTyping) {
  if (!lineageWs || lineageWs.readyState !== WebSocket.OPEN) return;
  lineageWs.send(JSON.stringify({ type: 'typing', isTyping }));
}

function showLineageTyping(userId, isTyping) {
  const indicator = document.getElementById('lineage-typing-indicator');
  if (!indicator) return;
  if (userId === currentSession.user.id) return;
  
  if (isTyping) {
    indicator.innerText = 'กำลังพิมพ์...';
    indicator.style.opacity = '1';
  } else {
    indicator.innerText = '';
    indicator.style.opacity = '0';
  }
}

// ==============================================
// COUNTDOWN TIMER
// ==============================================
function initCountdown() {
  const config = getGlobalConfig();
  if (!config.revealTime) return;
  
  const targetDate = new Date(config.revealTime).getTime();
  const container = document.getElementById('countdown-container');
  container.style.display = 'block';
  
  setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
      document.getElementById('cd-days').innerText = "00";
      document.getElementById('cd-hours').innerText = "00";
      document.getElementById('cd-mins').innerText = "00";
      document.getElementById('cd-secs').innerText = "00";
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('cd-days').innerText = days.toString().padStart(2, '0');
    document.getElementById('cd-hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('cd-mins').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('cd-secs').innerText = seconds.toString().padStart(2, '0');
  }, 1000);
}

// ==============================================
// GLOBAL CHAT UI METHODS
// ==============================================
function appendGlobalMessage(msg) {
  const box = document.getElementById('global-messages-box');
  if (!box) return;
  const isMe = msg.senderId === (currentSession ? currentSession.user.id : '');
  const isAdmin = msg.senderRole === 'admin' || msg.senderName === 'Admin';
  const timeStr = new Date(msg.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  
  let msgContent = escapeHtml(msg.text);
  
  const adminClass = isAdmin ? ' admin-msg' : '';
  const displayName = isAdmin ? '👑 Admin' : msg.senderName;
  
  const html = `
    <div class="msg-bubble ${isMe ? 'outgoing' : 'incoming'}${adminClass}">
      <div class="msg-sender${isAdmin ? ' admin-sender' : ''}">${displayName}</div>
      <div class="msg-content">${msgContent}</div>
      <div class="msg-time">${timeStr}</div>
    </div>
  `;
  
  // ลบข้อความ "รอโหลด" ถ้ายังมีอยู่
  const placeholder = box.querySelector('p');
  if (placeholder && placeholder.textContent.includes('รอโหลด')) {
    box.innerHTML = '';
  }
  
  box.innerHTML += html;
  box.scrollTop = box.scrollHeight;
  
  // อัปเดต mission bar ถ้าเป็นตัวเราส่ง (fallback เผื่อลืมบวก)
  if (isMe) updateMissionBar();

  // ระบบแจ้งเตือน (Notifications)
  if (!isMe && document.hidden) {
    const toggle = document.getElementById('toggle-notifications');
    if (toggle && toggle.checked && Notification.permission === 'granted') {
      new Notification(`ข้อความใหม่จาก ${displayName}`, { body: msgContent });
    }
  }
}

function appendSystemMessage(text) {
  const box = document.getElementById('global-messages-box');
  if (!box) return;
  
  const html = `
    <div style="text-align: center; margin: 10px 0; color: var(--accent-gold); font-weight: bold; font-size: 0.9rem; padding: 8px; background: rgba(255,215,0,0.1); border-radius: 8px;">
      ${text}
    </div>
  `;
  box.innerHTML += html;
  box.scrollTop = box.scrollHeight;
}

function showGlobalTyping(userId, isTyping) {
  const indicator = document.getElementById('global-typing-indicator');
  if (!indicator) return;
  if (userId === currentSession.user.id) return;
  
  if (isTyping) {
    indicator.innerText = 'กำลังพิมพ์...';
  } else {
    indicator.innerText = '';
  }
}

function showFloatingReaction(emoji) {
  const container = document.getElementById('floating-reactions');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'floating-emoji';
  el.innerText = emoji;
  el.style.left = Math.random() * 30 + 'px';
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ==============================================
// AIRDROP SYSTEM
// ==============================================
function showAirdropOffer(data) {
  const container = document.getElementById('airdrop-container');
  if (!container) return;
  
  const btn = document.createElement('button');
  btn.className = 'airdrop-item';
  btn.id = `airdrop-${data.airdropId}`;
  btn.innerHTML = `⭐ กดรับ ${data.starsPerPerson} ดาว! (เหลือ ${data.maxClaimers} คน)`;
  btn.onclick = () => {
    btn.disabled = true;
    btn.innerText = 'กำลังรับ...';
    if (globalWs && globalWs.readyState === WebSocket.OPEN) {
      globalWs.send(JSON.stringify({ 
        type: 'airdrop', 
        airdropId: data.airdropId,
        userName: currentSession.role === 'admin' ? 'Admin' : (currentSession.user.globalName || 'ไม่ระบุ')
      }));
    }
  };
  container.appendChild(btn);
  
  // หายไปหลัง 30 วินาที
  setTimeout(() => { if (btn.parentNode) btn.remove(); }, 30000);
}

function showAirdropClaim(data) {
  appendSystemMessage(`🌟 ${data.userName} ได้รับ ${data.starsAmount} ดาวจาก Airdrop! (เหลืออีก ${data.remainingSlots} คน)`);
  
  // อัปเดตดาวถ้าเราเป็นคนกดรับ
  if (data.userId === currentSession.user.id) {
    currentSession.user.stars = (currentSession.user.stars || 0) + (data.starsAmount || 1);
    document.getElementById('star-count-val').innerText = currentSession.user.stars;
    sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
  }
  
  // อัปเดตปุ่ม airdrop
  const btn = document.getElementById(`airdrop-${data.airdropId}`);
  if (btn) {
    btn.innerHTML = `⭐ เหลือ ${data.remainingSlots} คน`;
  }
}

function hideAirdropOffer(airdropId) {
  const btn = document.getElementById(`airdrop-${airdropId}`);
  if (btn) {
    btn.innerHTML = '❌ หมดแล้ว!';
    btn.disabled = true;
    setTimeout(() => btn.remove(), 3000);
  }
  appendSystemMessage('🪂 Airdrop หมดแล้ว! ไว้รอรอบหน้านะ~');
}

function sendAdminAirdrop() {
  if (!globalWs || globalWs.readyState !== WebSocket.OPEN) {
    alert('กรุณาเชื่อมต่อแชทโลกก่อน');
    return;
  }
  
  const starsPerPerson = parseInt(document.getElementById('airdrop-stars-input').value) || 2;
  const maxClaimers = parseInt(document.getElementById('airdrop-slots-input').value) || 5;
  const airdropId = `airdrop_${Date.now()}`;
  
  globalWs.send(JSON.stringify({
    type: 'admin_airdrop',
    starsPerPerson,
    maxClaimers,
    airdropId
  }));
  
  appendSystemMessage(`🪂 Admin ปล่อย Airdrop! ${starsPerPerson} ดาว จำกัด ${maxClaimers} คน!`);
}

// ==============================================
// MISSION PROGRESS BAR
// ==============================================
function updateMissionBar() {
  const msgCount = currentSession ? (currentSession.user.globalMessageCount || 0) : 0;
  const target = 5;
  const progress = Math.min(msgCount, target);
  const percent = (progress / target) * 100;
  
  const textEl = document.getElementById('mission-progress-text');
  const fillEl = document.getElementById('mission-progress-fill');
  
  if (textEl) textEl.innerText = `${progress}/${target} ข้อความ`;
  if (fillEl) fillEl.style.width = `${percent}%`;
  
  if (progress >= target && textEl) {
    textEl.innerText = '✅ สำเร็จแล้ว!';
  }
}

function updateLineageMissionBar() {
  const msgCount = currentSession ? (currentSession.user.lineageMessageCount || 0) : 0;
  const target = 5;
  const progress = Math.min(msgCount, target);
  const percent = (progress / target) * 100;
  
  const textEl = document.getElementById('lineage-mission-progress-text');
  const fillEl = document.getElementById('lineage-mission-progress-fill');
  
  if (textEl) textEl.innerText = `${progress}/${target} ข้อความ`;
  if (fillEl) fillEl.style.width = `${percent}%`;
  
  if (progress >= target && textEl) {
    textEl.innerText = '✅ สำเร็จแล้ว!';
  }
}

// ==============================================
// DAILY REWARD POPUP
// ==============================================
function showDailyReward(streakCount, starsEarned) {
  const modal = document.getElementById('daily-reward-modal');
  if (!modal) return;
  
  document.getElementById('daily-streak-count').innerText = streakCount;
  
  let rewardHTML = `<div class="reward-line"><span>ดาวประจำวัน</span><span>+1 ⭐</span></div>`;
  let totalStars = 1;
  
  if (streakCount === 45) {
    rewardHTML += `<div class="reward-line bonus"><span>🎉 โบนัสครบ 45 วัน!</span><span>+15 ⭐</span></div>`;
    totalStars = 16;
  } else if (streakCount > 0 && streakCount % 5 === 0) {
    rewardHTML += `<div class="reward-line bonus"><span>🎉 โบนัส ${streakCount} วันติดต่อกัน!</span><span>+5 ⭐</span></div>`;
    totalStars = 6;
  }
  
  if (starsEarned) totalStars = starsEarned;
  
  document.getElementById('daily-reward-stars').innerHTML = rewardHTML;
  document.getElementById('daily-reward-total').innerHTML = `รวมได้รับ: <strong>+${totalStars} ⭐</strong>`;
  
  modal.style.display = 'flex';
}

function closeDailyReward() {
  document.getElementById('daily-reward-modal').style.display = 'none';
}

// ==============================================
// LEADERBOARD & GLOBAL MESSAGES FETCH
// ==============================================
async function fetchGlobalMessages() {
  try {
    const res = await fetch('/api/global-messages');
    if (res.ok) {
      const messages = await res.json();
      const box = document.getElementById('global-messages-box');
      if (box) {
        box.innerHTML = '';
        messages.forEach(appendGlobalMessage);
      }
    }
  } catch (e) {
    console.error('Error fetching global messages', e);
  }
}

async function fetchLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const leaders = await res.json();
      const list = document.getElementById('global-leaderboard-list');
      if (!list) return;
      
      if (leaders.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 20px;">ยังไม่มีดาวในระบบ</p>';
        return;
      }
      
      const medals = ['🥇', '🥈', '🥉'];
      list.innerHTML = leaders.map((lb, idx) => `
        <div class="lb-item ${idx < 3 ? 'top-three' : ''}">
          <div class="lb-rank">${idx < 3 ? medals[idx] : '#' + (idx + 1)}</div>
          <div class="lb-name">${escapeHtml(lb.global_name || 'ไม่ระบุ')}</div>
          <div class="lb-score">⭐ ${lb.stars}</div>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error('Error fetching leaderboard', e);
  }
}

// ==============================================
// EVENT LISTENERS (Global Chat)
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
  // Reaction button
  document.getElementById('reaction-btn')?.addEventListener('click', () => {
    if (globalWs && globalWs.readyState === WebSocket.OPEN) {
      globalWs.send(JSON.stringify({ type: 'reaction', emoji: '❤️' }));
      showFloatingReaction('❤️');
    }
  });

  // Global chat send
  document.getElementById('global-send-btn')?.addEventListener('click', sendGlobalChatMessage);
  
  // Global chat input enter
  document.getElementById('global-chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendGlobalChatMessage();
  });
  
  // Global chat typing
  document.getElementById('global-chat-input')?.addEventListener('input', () => {
    if (globalWs && globalWs.readyState === WebSocket.OPEN) {
      globalWs.send(JSON.stringify({ type: 'typing', isTyping: true }));
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        if (globalWs && globalWs.readyState === WebSocket.OPEN) {
          globalWs.send(JSON.stringify({ type: 'typing', isTyping: false }));
        }
      }, 2000);
    }
  });
  
  // Admin Edit Form
  document.getElementById('admin-edit-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('admin-edit-userId').value;
    const name = document.getElementById('admin-edit-name').value;
    const avatar = document.getElementById('admin-edit-avatar').value;
    const ig = document.getElementById('admin-edit-ig').value;
    const stars = parseInt(document.getElementById('admin-edit-stars').value) || 0;
    
    const user = window.adminDataCache?.users?.find(u => u.id === userId);
    
    try {
      const res = await fetch("/api/admin-update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          adminId: currentSession.user.id, 
          userId, name, ig, avatar, 
          major: user ? user.major : '', 
          stars 
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("บันทึกข้อมูลผู้ใช้เรียบร้อย");
        document.getElementById('admin-edit-modal').style.display = 'none';
        renderAdminDashboard();
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      alert("การเชื่อมต่อมีปัญหา");
    }
  });
});

function sendGlobalChatMessage() {
  const input = document.getElementById('global-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text || !globalWs || globalWs.readyState !== WebSocket.OPEN) return;
  
  if (currentSession.role !== 'admin' && currentSession.config && currentSession.config.globalChatEnabled === false) {
    alert("แชทโลกถูกปิดใช้งานชั่วคราวโดยแอดมิน");
    input.value = '';
    return;
  }
  
  const displayName = currentSession.role === 'admin' ? 'Admin' : (currentSession.user.globalName || 'ไม่ระบุ');
  
  const msg = {
    senderId: currentSession.user.id,
    senderName: displayName,
    senderRole: currentSession.role,
    text: text,
    timestamp: new Date().toISOString()
  };
  
  globalWs.send(JSON.stringify({ type: 'chat', roomId: 'global', message: msg }));
  input.value = '';
  
  // อัปเดต Mission Bar แชทโลก
  if (currentSession.role !== 'admin') {
    currentSession.user.globalMessageCount = (currentSession.user.globalMessageCount || 0) + 1;
    updateMissionBar();
    sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
  }

  
  // Stop typing indicator
  globalWs.send(JSON.stringify({ type: 'typing', isTyping: false }));
}

window.toggleNotifications = function(enabled) {
  if (enabled && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
    Notification.requestPermission().then(perm => {
      if (perm !== 'granted') {
        document.getElementById('toggle-notifications').checked = false;
        alert("กรุณาอนุญาตการแจ้งเตือนในหน้าตั้งค่าของเบราว์เซอร์");
      }
    });
  }
};

// ==============================================
// BUDDY SYSTEM
// ==============================================
let currentBuddies = [];
let activeBuddyId = null;
let buddyWs = null;

window.loadBuddyData = async function() {
  if (!currentSession || !currentSession.user) return;
  if (currentSession.role === 'admin') {
    document.getElementById('buddy-info-panel').innerHTML = '<p>แอดมินไม่มีบัดดี้ครับ</p>';
    return;
  }
  
  try {
    const res = await fetch(`/api/get-buddies?userId=${currentSession.user.id}&role=${currentSession.role}`);
    const data = await res.json();
    if (res.ok) {
      currentBuddies = data.buddies || [];
      if (currentBuddies.length === 0) {
        document.getElementById('buddy-info-panel').innerHTML = '<div style="text-align:center; padding: 40px; color: #888;">คุณยังไม่มีบัดดี้ในขณะนี้</div>';
        document.getElementById('buddy-chat-messages').innerHTML = '';
        return;
      }
      
      // เลือกคนแรกเป็นค่าเริ่มต้น
      if (!activeBuddyId && currentBuddies.length > 0) {
        activeBuddyId = currentBuddies[0].pair_id;
      }
      
      renderBuddyTabs();
      renderActiveBuddy();
      connectBuddyWebSocket(activeBuddyId);
    }
  } catch (e) {
    console.error("Failed to load buddies", e);
  }
};

function renderBuddyTabs() {
  const container = document.getElementById('buddy-tabs-container');
  if (!container) return;
  
  if (currentBuddies.length <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '<div style="display:flex; flex-direction:column; gap:10px;">';
  currentBuddies.forEach(b => {
    const isActive = b.pair_id === activeBuddyId;
    html += `<button class="dev-btn ${isActive ? 'active' : ''}" style="width:100%; text-align:left; background: ${isActive ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}; color: ${isActive ? '#000' : '#fff'};" onclick="switchBuddy('${b.pair_id}')">${b.name}</button>`;
  });
  html += '</div>';
  
  container.innerHTML = html;
}

let activeLineageRoom = 'group';

window.switchLineageRoom = function(target) {
  activeLineageRoom = target;
  
  // Update tab UI
  document.querySelectorAll('.chat-sidebar-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.getElementById(`tab-lineage-${target}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  // Update Header text based on target
  const titleEl = document.getElementById('chat-room-title');
  if (titleEl) {
    if (target === 'group') {
      titleEl.innerText = currentSession.role === 'junior' ? 'แชทคุยกับพี่รหัส (กลุ่ม)' : 'แชทคุยกับน้องรหัส (กลุ่ม)';
    } else if (target === 'private') {
      titleEl.innerText = 'แชทส่วนตัวกับพี่รหัส';
    } else {
      const juniorName = currentSession.lineage.juniors.find(j => j.id === target)?.name || 'น้องรหัส';
      titleEl.innerText = `แชทส่วนตัวกับ ${juniorName}`;
    }
  }

  // Reconnect WS to the new room
  // Clear old messages first
  const chatBox = document.getElementById('chat-messages-box');
  if (chatBox) chatBox.innerHTML = '';
  connectLineageWebSocket();
};

// ใช้ API buddy-messages เดิมในการดึงประวัติแชท (เปลี่ยนชื่อฟังก์ชันให้ครอบคลุม)
async function fetchRoomMessages(roomId) {
  try {
    let url = `/api/room-messages?roomId=${roomId}`;
    if (roomId.startsWith('buddy_')) {
      url = `/api/buddy-messages?roomId=${roomId}`;
    }
    const res = await fetch(url);
    if (res.ok) {
      const messages = await res.json();
      const box = document.getElementById('chat-messages-box');
      if (box) {
        box.innerHTML = '';
        messages.forEach(msg => {
          appendLineageMessage(msg.senderName, msg.text, msg.senderId === currentSession.user.id, msg.timestamp, msg.senderRole);
        });
      }
    }
  } catch (e) {
    console.error('Error fetching room messages', e);
  }
}

window.switchBuddy = function(pairId) {
  activeBuddyId = pairId;
  renderBuddyTabs();
  renderActiveBuddy();
  connectBuddyWebSocket(activeBuddyId);
};

function renderActiveBuddy() {
  const buddy = currentBuddies.find(b => b.pair_id === activeBuddyId);
  if (!buddy) return;
  
  const panel = document.getElementById('buddy-info-panel');
  if (!panel) return;
  
  const contentHtml = `
    <div class="buddy-content" style="text-align: center; margin-top: 20px;">
      <div class="user-profile-widget" style="flex-direction: column; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px;">
        <div class="user-avatar" style="width:100px; height:100px; margin:0 auto 15px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1);">
          ${buddy.photo_url ? `<img src="${buddy.photo_url}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:4rem;">${buddy.avatar || '👤'}</span>`}
        </div>
        <div class="user-details">
          <h3 style="color: var(--accent-gold); font-size:1.3rem;">${buddy.name}</h3>
          <p style="margin-bottom: 5px;">สาขา: ${buddy.major}</p>
          
          <div style="margin-top: 15px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; text-align: center;">
            <span style="color: #E1306C; font-size:1.1rem;">📸 IG: @${buddy.ig || 'ไม่ได้ระบุ'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  panel.innerHTML = contentHtml;
}

function connectBuddyWebSocket(pairId) {
  if (buddyWs) {
    buddyWs.close();
    buddyWs = null;
  }
  
  document.getElementById('buddy-chat-messages').innerHTML = ''; // เคลียร์ข้อความเก่า
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  buddyWs = new WebSocket(`${protocol}//${window.location.host}/api/ws-chat?roomId=buddy_${pairId}&userId=${currentSession.user.id}&role=${currentSession.role}`);
  
  buddyWs.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'chat') {
        const msg = data.message;
        appendBuddyMessage(msg.senderName, msg.text, msg.senderId === currentSession.user.id, msg.timestamp);
      }
    } catch (e) {}
  };
  
  // โหลดประวัติแชทเก่าเมื่อเชื่อมต่อ
  fetchBuddyMessages(`buddy_${pairId}`);
}

async function fetchBuddyMessages(roomId) {
  try {
    const res = await fetch(`/api/buddy-messages?roomId=${roomId}`);
    if (res.ok) {
      const messages = await res.json();
      const box = document.getElementById('buddy-chat-messages');
      if (box) {
        box.innerHTML = '';
        messages.forEach(msg => {
          appendBuddyMessage(msg.senderName, msg.text, msg.senderId === currentSession.user.id, msg.timestamp);
        });
      }
    }
  } catch (e) {
    console.error('Error fetching buddy messages', e);
  }
}

function appendBuddyMessage(senderName, text, isMe, timestamp) {
  const container = document.getElementById('buddy-chat-messages');
  if (!container) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg-bubble ${isMe ? 'outgoing' : 'incoming'}`;
  
  const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '';
  
  msgDiv.innerHTML = `
    <div class="msg-sender">${senderName}</div>
    <div class="msg-content">${escapeHTML(text)}</div>
    <div class="msg-time">${timeStr}</div>
  `;
  
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

// Buddy Chat Submit (called via onsubmit in HTML)
window.handleBuddyChatSubmit = function(e) {
  e.preventDefault();
  const input = document.getElementById('buddy-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (text && buddyWs && buddyWs.readyState === WebSocket.OPEN) {
    const displayName = currentSession.role === 'admin' ? 'Admin' : currentSession.user.name;
    
    buddyWs.send(JSON.stringify({
      type: 'chat',
      roomId: `buddy_${activeBuddyId}`,
      message: {
        senderId: currentSession.user.id,
        senderName: displayName,
        senderRole: currentSession.role,
        text: text,
        timestamp: new Date().toISOString()
      }
    }));
    input.value = '';
  }
};

// ==========================================
// CHAT UI HELPERS
// ==========================================
window.escapeHTML = function(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
};

window.appendLineageMessage = function(senderName, text, isMe, timestamp, senderRole) {
  const container = document.getElementById('chat-messages-box');
  if (!container) return;
  
  let displayName = senderName;
  if (senderRole === 'senior' && currentSession.lineage && !currentSession.lineage.revealed && !isMe) {
    displayName = 'พี่รหัสผู้ลึกลับ ❓';
  }
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg-bubble ${isMe ? 'outgoing' : 'incoming'}`;
  
  const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '';
  let roleBadge = '';
  if (senderRole === 'senior') roleBadge = '<span style="color:#ffb703; font-size:10px; border:1px solid #ffb703; padding:1px 4px; border-radius:4px; margin-right:4px;">พี่รหัส</span>';
  else if (senderRole === 'admin') roleBadge = '<span style="color:#ff0000; font-size:10px; border:1px solid #ff0000; padding:1px 4px; border-radius:4px; margin-right:4px;">Admin</span>';
  
  msgDiv.innerHTML = `
    <div class="msg-sender">${roleBadge}${displayName}</div>
    <div class="msg-content">${escapeHTML(text)}</div>
    <div class="msg-time">${timeStr}</div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
};

window.appendGlobalMessage = function(msg) {
  const container = document.getElementById('global-messages-box');
  if (!container) return;
  const isMe = msg.senderId === currentSession.user.id;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg-bubble ${isMe ? 'outgoing' : 'incoming'}`;
  
  if (msg.senderRole === 'admin') {
    msgDiv.className += ' admin-msg';
  }
  
  const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '';
  let roleBadge = '';
  if (msg.senderRole === 'admin') roleBadge = '<span style="color:#ff0000; font-size:10px; border:1px solid #ff0000; padding:1px 4px; border-radius:4px; margin-right:4px;">Admin</span>';
  
  let senderClass = msg.senderRole === 'admin' ? 'msg-sender admin-sender' : 'msg-sender';
  
  msgDiv.innerHTML = `
    <div class="${senderClass}">${roleBadge}${msg.senderName}</div>
    <div class="msg-content">${escapeHTML(msg.text)}</div>
    <div class="msg-time">${timeStr}</div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
};

window.appendSystemMessage = function(text) {
  const container = document.getElementById('global-messages-box');
  if (!container) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg-bubble incoming system-msg';
  msgDiv.style.alignSelf = 'center';
  msgDiv.innerHTML = `<div class="msg-content" style="background: rgba(255,255,255,0.1); color: #fff; text-align: center; border: 1px solid var(--accent-gold);">${text}</div>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
};

window.handleGlobalChatSubmit = function(event) {
  if (event) event.preventDefault();
  
  const input = document.getElementById('global-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  if (globalWs && globalWs.readyState === WebSocket.OPEN) {
    const msg = {
      id: 'temp_' + Date.now(), 
      senderId: currentSession.user.id,
      senderName: currentSession.user.global_name || currentSession.user.name,
      senderRole: currentSession.role,
      text: text,
      timestamp: new Date().toISOString()
    };
    
    globalWs.send(JSON.stringify({
      type: 'chat',
      roomId: 'global',
      message: msg
    }));
    
    input.value = '';
    
    // อัปเดต Mission Bar แชทโลก
    if (currentSession.role !== 'admin') {
      currentSession.user.globalMessageCount = (currentSession.user.globalMessageCount || 0) + 1;
      updateGlobalMissionBar();
    }
    
    sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
  }
};
