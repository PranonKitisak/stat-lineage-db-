// app.js - Logic การทำงานของเว็บแอปพลิเคชันระบบสายรหัส

// ตัวแปรเก็บสถานะการเข้าใช้งานปัจจุบัน
let currentSession = null;
let chatInterval = null;
let lastConfigState = { specialHintsRevealed: null, guessingEnabled: null };

// ใช้ไลบรารี canvas-confetti จาก CDN แทน
function startConfetti() {
  if (typeof confetti === 'function') {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  }
}

// โหลดเอกสารสำเร็จ
document.addEventListener('DOMContentLoaded', () => {
  // ดึงข้อมูลสายรหัสจาก database.js (getLineages ถูกโหลดเข้ามาจาก database.js ก่อนหน้า)
  getLineages();

  // ตรวจสอบ Session เดิม
  restoreSession();

  // ติดตั้ง Event Listeners
  setupEventListeners();

  // โหลดรายชื่อผู้พัฒนาและปุ่มสลับ
  renderDevTools();

  // เริ่มต้น Canvas Confetti
  initConfetti();
});

// ฟังก์ชันติดตั้ง Event Listeners ต่างๆ
function setupEventListeners() {
  // สลับ Role ในการล็อกอิน
  const roleButtons = document.querySelectorAll('.role-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      roleButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  // ฟอร์ม Log In
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // ปุ่มเปิด/ปิด Dev Tools Drawer
  const devToggle = document.getElementById('dev-toggle');
  const devDrawer = document.getElementById('dev-drawer');
  const closeDev = document.getElementById('close-dev');

  if (devToggle && devDrawer) {
    devToggle.addEventListener('click', () => {
      devDrawer.classList.toggle('open');
    });
  }
  if (closeDev && devDrawer) {
    closeDev.addEventListener('click', () => {
      devDrawer.classList.remove('open');
    });
  }

  // ปิด drawer เมื่อคลิกภายนอก
  document.addEventListener('click', (e) => {
    if (devDrawer && devDrawer.classList.contains('open')) {
      if (!devDrawer.contains(e.target) && (!devToggle || !devToggle.contains(e.target))) {
        devDrawer.classList.remove('open');
      }
    }
  });
}

// ฟังก์ชันเปิดปิด Dev Tools Drawer จากปุ่มหน้า Admin
window.toggleDevDrawer = function() {
  const drawer = document.getElementById('dev-drawer');
  if (drawer) {
    if (drawer.style.display === 'none') {
      drawer.style.display = 'flex';
      setTimeout(() => drawer.classList.add('open'), 10);
    } else {
      drawer.classList.remove('open');
      setTimeout(() => drawer.style.display = 'none', 300); // Wait for transition
    }
  }
};

// ฟังก์ชันทำเรื่องล็อกอิน
async function handleLogin(e) {
  e.preventDefault();

  const activeBtn = document.querySelector('.role-btn.active');
  const role = activeBtn ? activeBtn.dataset.role : 'junior';
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorMsg = document.getElementById('error-msg');

  const submitBtn = document.getElementById('login-submit-btn');
  const originalBtnText = submitBtn ? submitBtn.textContent : "เข้าสู่ระบบ";
  if (submitBtn) {
    submitBtn.textContent = "กำลังเข้าระบบ...";
    submitBtn.disabled = true;
  }

  try {
    const result = await checkLogin(role, email, password);

    if (result) {
      errorMsg.style.display = 'none';
      currentSession = result;
      sessionStorage.setItem('stat_session', JSON.stringify(result));

      // เคลียร์ค่าฟอร์ม
      document.getElementById('login-email').value = '';
      document.getElementById('login-password').value = '';

      // ถ้าเป็น admin หรือเปลี่ยนรหัสแล้ว ให้ไปแดชบอร์ดเลย
      if (result.user.hasChangedPassword === false) {
        showChangePasswordModal(true);
      } else if (result.role === 'senior' && !result.user.hasSeenRoulette) {
        // พี่รหัสเคยเปลี่ยนรหัสแล้ว แต่ยังไม่ได้ดู roulette ให้แสดง roulette ก่อน
        renderDashboard();
        showRouletteModal();
      } else {
        renderDashboard();
      }
    } else {
      errorMsg.style.display = 'block';
      errorMsg.textContent = 'ไม่พบอีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
    }
  } catch (err) {
    errorMsg.style.display = 'block';
    errorMsg.textContent = 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง';
  } finally {
    if (submitBtn) {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}

// ตรวจสอบและกู้คืน Session
async function restoreSession() {
  const savedSession = sessionStorage.getItem('stat_session');
  if (savedSession) {
    try {
      const parsed = JSON.parse(savedSession);

      // ดึงข้อมูลอัปเกรดล่าสุดจาก Cloudflare Server มาเก็บใน local cache ก่อนเรนเดอร์
      await syncWithServer();
      const freshConfig = getGlobalConfig();
      parsed.config = freshConfig;

      // ถ้าเป็น admin หรือไม่มี lineage (admin ไม่มี lineage) ให้ restore และ render เลย
      if (parsed.role === 'admin' || !parsed.lineage) {
        currentSession = parsed;
        sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
        renderDashboard();
        return;
      }

      const lineages = getLineages();
      const updatedLin = lineages.find(l => l.id === parsed.lineage.id);
      if (updatedLin) {
        currentSession = {
          role: parsed.role,
          user: parsed.role === 'senior' ? updatedLin.senior : updatedLin.juniors.find(j => j.id === parsed.user.id),
          lineage: updatedLin,
          config: freshConfig
        };
        // ถ้า user จาก localStorage ใช้ parsed.user สำหรับข้อมูลที่ล้าหลังใน DB (like hasSeenRoulette)
        if (!currentSession.user) {
          currentSession.user = parsed.user;
        } else {
          // แมเจ้ hasChangedPassword และ hasSeenRoulette จาก saved session
          currentSession.user.hasChangedPassword = parsed.user.hasChangedPassword;
          currentSession.user.hasSeenRoulette = parsed.user.hasSeenRoulette;
        }
        sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      } else {
        currentSession = parsed;
      }
      renderDashboard();
    } catch (e) {
      console.error("Error restoring session", e);
      sessionStorage.removeItem('stat_session');
      await syncWithServer();
      showAuth();
    }
  } else {
    // โหลดข้อมูลล่าสุดมาใส่ local cache เพื่อพร้อมให้ปุ่ม Login ด่วนใน Dev panel ดึงใช้งาน
    await syncWithServer();
    showAuth();
  }
}

// แสดงหน้าล็อกอิน
function showAuth() {
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('dashboard-section').style.display = 'none';
  if (chatInterval) {
    clearInterval(chatInterval);
    chatInterval = null;
  }
}

// ออกจากระบบ
function handleLogout() {
  
  currentSession = null;
  sessionStorage.removeItem('stat_session');
  document.getElementById('app-navbar').style.display = 'none';
  document.getElementById('countdown-container').style.display = 'none';
  document.getElementById('globalchat-section').style.display = 'none';
  if (typeof globalWs !== 'undefined' && globalWs) {
    globalWs.close();
    globalWs = null;
  }
  if (typeof lineageWs !== 'undefined' && lineageWs) {
    lineageWs.close();
    lineageWs = null;
  }
  showAuth();
}

// ฟังก์ชันเรนเดอร์หน้า Dashboard ทั้งหมด
function renderDashboard() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('globalchat-section').style.display = 'none';
  const dashboard = document.getElementById('dashboard-section');
  dashboard.style.display = 'block';

  // ล้างเนื้อหาเก่าในแดชบอร์ด
  dashboard.innerHTML = '';

  const role = currentSession.role;
  const user = currentSession.user;
  const lineage = currentSession.lineage;

  if (role === 'admin') {
    renderAdminDashboard();
    // แอดมินก็เห็น navbar เพื่อเข้าแชทโลกได้
    document.getElementById('app-navbar').style.display = 'flex';
    document.getElementById('navbar-streak').style.display = 'none';
  } else if (role === 'junior') {
    renderJuniorDashboard(user, lineage);
  } else if (role === 'senior') {
    renderSeniorDashboard(user, lineage);
  }

  document.getElementById('dev-drawer').style.display = 'none';

  if (role !== 'admin') {
    // แสดง Navbar พร้อมดาวและ Streak
    document.getElementById('app-navbar').style.display = 'flex';
    document.getElementById('navbar-streak').style.display = 'flex';
    document.getElementById('star-count-val').innerText = currentSession.user.stars || 0;
    document.getElementById('streak-count-val').innerText = currentSession.user.loginStreak || 0;

    // Init Countdown
    if (typeof initCountdown === 'function') initCountdown();

    // เชื่อมต่อ WebSocket แชทสายรหัส
    if (typeof connectLineageWebSocket === 'function') connectLineageWebSocket();

    // เริ่มต้นดึงข้อมูลอัปเดตแบบ Dynamic (ทุกๆ 5 วินาที - ลดความถี่เพราะมี WS แล้ว)
    if (chatInterval) clearInterval(chatInterval);
    chatInterval = setInterval(syncSessionData, 5000);

    // แสดง Daily Reward Popup ถ้าเป็นวันใหม่
    if (currentSession.user.isNewDay) {
      setTimeout(() => {
        showDailyReward(currentSession.user.loginStreak || 1, currentSession.user.dailyStarsEarned || 1);
        currentSession.user.isNewDay = false;
        sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      }, 500);
    }
  }
}

// ตรวจสอบและดึงข้อมูลอัปเดตแชท/การเฉลยสายรหัสจาก localStorage แบบ Real-time
async function syncSessionData() {
  if (!currentSession) return;

  // ซิงค์ข้อมูลล่าสุดจาก Cloudflare Server ก่อนเช็คความแตกต่าง
  await syncWithServer();

  const lineages = getLineages();
  const updatedLin = lineages.find(l => l.id === currentSession.lineage.id);

  if (updatedLin) {
    // เช็คว่ามีการเปลี่ยนแปลงของข้อความแชท หรือการถูกเฉลยหรือไม่
    const oldMessagesCount = currentSession.lineage.messages.length;
    const newMessagesCount = updatedLin.messages.length;
    const oldRevealed = currentSession.lineage.revealed;
    const newRevealed = updatedLin.revealed;
    const oldHintsCount = currentSession.lineage.hints.length;
    const newHintsCount = updatedLin.hints.length;

    currentSession.lineage = updatedLin;
    sessionStorage.setItem('stat_session', JSON.stringify(currentSession));

    // หากมีการอัปเดตแชท ให้เรนเดอร์ใหม่เฉพาะกล่องแชท
    if (oldMessagesCount !== newMessagesCount) {
      renderChatMessages();
    }

    // หากมีการเฉลยตัวตนจาก Admin ให้เล่นเอฟเฟกต์
    if (oldRevealed !== newRevealed && currentSession.role === 'junior') {
      const cardInner = document.getElementById('reveal-card-inner');
      if (newRevealed && cardInner && !cardInner.classList.contains('flipped')) {
        cardInner.classList.add('flipped');
        startConfetti();
        renderJuniorSeniorCardDetails();
      } else if (!newRevealed && cardInner && cardInner.classList.contains('flipped')) {
        cardInner.classList.remove('flipped');
      }
    }

    // หากพี่รหัสแอบแก้คำใบ้ ให้เรนเดอร์คำใบ้ใหม่ในฝั่งน้อง
    if (oldHintsCount !== newHintsCount && currentSession.role === 'junior') {
      renderJuniorHints();
    }

    // ซิงค์การเปลี่ยนแปลงของระบบวันงานสำหรับน้องรหัส
    if (currentSession.role === 'junior') {
      const config = getGlobalConfig();
      if (lastConfigState.specialHintsRevealed !== config.specialHintsRevealed) {
        lastConfigState.specialHintsRevealed = config.specialHintsRevealed;
        renderJuniorHints();
      }
      if (lastConfigState.guessingEnabled !== config.guessingEnabled) {
        lastConfigState.guessingEnabled = config.guessingEnabled;
        renderJuniorGuessingPanel();
      }

      // อัปเดตสถานะแผงเดาหากมีการเปลี่ยนสถานะเฉลยในเบื้องหลัง
      const guessingContainer = document.getElementById('junior-guessing-container');
      if (guessingContainer) {
        const isQuizVisible = document.getElementById('guess-senior-name') !== null || document.getElementById('guess-senior-major') !== null;
        if (updatedLin.revealed && isQuizVisible) {
          renderJuniorGuessingPanel();
        } else if (!updatedLin.revealed && !isQuizVisible && config.guessingEnabled) {
          renderJuniorGuessingPanel();
        }
      }
    }
  }
}

// ---------------------------------
// JUNIOR DASHBOARD RENDERING
// ---------------------------------
function renderJuniorDashboard(user, lineage) {
  const dashboard = document.getElementById('dashboard-section');

  const html = `
    <div class="dashboard-grid">
      <!-- คอลัมน์ซ้าย: ข้อมูลสายรหัสและคำใบ้ -->
      <div class="info-panel">
        <div class="panel-title">
          <span>📋 ข้อมูลของฉัน</span>
        </div>
        <div class="user-profile-widget">
          <div class="user-avatar">${user.avatar || '🐰'}</div>
          <div class="user-details">
            <h3>${user.name}</h3>
            <p>รหัสนิสิต: ${user.id}</p>
            <p>สาขา: ${user.major}</p>
            ${user.ig ? `<p style="color: #E1306C; font-size: 0.9rem;">📸 IG: ${user.ig}</p>` : ''}
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 5px;">สิ่งที่ชอบ (ให้พี่รหัสเห็น):</p>
              <div style="display: flex; gap: 5px; align-items: center;">
                <input type="text" id="junior-favorites-input" class="input-control" value="${user.favorites || 'ยังไม่ได้ระบุ'}" style="padding: 5px 10px; font-size: 0.85rem; margin-bottom: 0;">
                <button class="primary-btn" onclick="saveFavorites()" style="padding: 5px 10px; font-size: 0.85rem; height: auto;">💾</button>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-title">
          <span>🕵️‍♂️ พี่รหัสผู้ลึกลับ</span>
        </div>
        
        <!-- การ์ดเฉลยสายรหัส (3D Flip) -->
        <div class="reveal-card-container">
          <div class="reveal-card-inner ${lineage.revealed ? 'flipped' : ''}" id="reveal-card-inner">
            <!-- ด้านหน้า: ล็อคอยู่ -->
            <div class="card-front">
              <div class="lock-icon">🔒</div>
              <h4>ใครคือพี่รหัสของคุณ?</h4>
              <p>ขณะนี้พี่รหัสยังไม่เฉลยตัวตน คุยแชทสืบหาเบาะแสและแกะคำใบ้ด้านล่างไปก่อนนะ!</p>
            </div>
            <!-- ด้านหลัง: เฉลยแล้ว -->
            <div class="card-back" id="reveal-card-back">
              <!-- รายละเอียดพี่รหัสจะถูกเขียนขึ้นด้วยฟังก์ชัน renderJuniorSeniorCardDetails -->
            </div>
          </div>
        </div>

        <!-- ช่องทายสายรหัส -->
        <div id="junior-guessing-container"></div>

        <!-- รายการคำใบ้ -->
        <div class="panel-title">
          <span>💡 คำใบ้จากพี่รหัส</span>
        </div>
        <div class="hints-list" id="junior-hints-container">
          <!-- คำใบ้จะถูกเรนเดอร์ตรงนี้ -->
        </div>

        <button class="logout-btn" onclick="showChangePasswordModal(false)" style="margin-right: 10px; margin-bottom: 10px;">🔑 เปลี่ยนรหัสผ่าน</button>
        <button class="logout-btn" onclick="handleLogout()">ออกจากระบบ</button>
      </div>

      <!-- คอลัมน์ขวา: ห้องแชทสายรหัส -->
      <div class="content-panel">
        <div class="panel-title">
          <span>💬 ห้องแชทสายรหัส</span>
        </div>
        
        <div class="lineage-chat-wrapper" style="display: flex; gap: 15px; align-items: stretch; height: 500px;">
          ${lineage.juniors.length > 1 ? `
          <div class="chat-sidebar" style="width: 220px; background: rgba(0,0,0,0.2); border-radius: 15px; padding: 15px; display: flex; flex-direction: column; gap: 10px; border: 1px solid rgba(255,255,255,0.05); overflow-y: auto;">
            <h4 style="color: var(--accent-gold); font-size: 0.9rem; margin-bottom: 5px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">👥 เลือกห้องแชท</h4>
            <button class="chat-sidebar-btn active" id="tab-lineage-group" onclick="switchLineageRoom('group')">💬 แชทกลุ่ม</button>
            <button class="chat-sidebar-btn" id="tab-lineage-private" onclick="switchLineageRoom('private')">👤 คุยส่วนตัวกับพี่รหัส</button>
          </div>
          ` : ''}

          <div class="chat-container" style="flex: 1; height: 100%; border-radius: ${lineage.juniors.length > 1 ? '15px' : '15px'};">
            <div class="chat-header">
              <div class="chat-title-group">
                <h4 id="chat-room-title">แชทคุยกับพี่รหัส</h4>
                <p><span class="online-badge"></span> ระบบส่งข้อความแบบปลอดภัย (ไม่เผยชื่อพี่รหัส)</p>
              </div>
            </div>
            <div class="mission-bar" style="margin: 0 15px 15px 15px;">
              <div class="mission-bar-header">
                <span class="mission-title">⭐ ภารกิจสายรหัส: ส่งข้อความรับ 1 ดาว</span>
                <span class="mission-progress-text" id="lineage-mission-progress-text">0/5 ข้อความ</span>
              </div>
              <div class="mission-progress-bg">
                <div class="mission-progress-fill" id="lineage-mission-progress-fill" style="width: 0%"></div>
              </div>
            </div>
            <div class="chat-messages" id="chat-messages-box">
              <!-- ข้อความแชท -->
            </div>
            <div id="lineage-typing-indicator" class="typing-indicator"></div>
            <div class="chat-input-area">
              <input type="text" id="chat-input-field" class="chat-input" placeholder="พิมพ์ข้อความคุยตอบโต้..." autocomplete="off">
              <button class="send-msg-btn" id="send-msg-btn">✈️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  dashboard.innerHTML = html;

  // ซิงค์ค่าคอนฟิกและเรนเดอร์ข้อมูลย่อย
  const config = getGlobalConfig();
  lastConfigState = {
    specialHintsRevealed: config.specialHintsRevealed,
    guessingEnabled: config.guessingEnabled
  };

  renderJuniorHints();
  renderJuniorGuessingPanel();
  renderJuniorSeniorCardDetails();
  renderChatMessages();
  if (typeof updateLineageMissionBar === 'function') updateLineageMissionBar();

  // ตั้งค่าปุ่มส่งข้อความ
  setupChatSubmit();

  // ดักคลิกการ์ด (สามารถคลิกการ์ดเพื่อสลับอนิเมชั่นได้เฉพาะเวลาที่แอดมินปลดล็อคแล้ว)
  const cardInner = document.getElementById('reveal-card-inner');
  if (cardInner) {
    cardInner.addEventListener('click', () => {
      if (currentSession.lineage.revealed) {
        cardInner.classList.toggle('flipped');
      }
    });
  }
}

function renderJuniorHints() {
  const container = document.getElementById('junior-hints-container');
  if (!container) return;

  const hints = currentSession.lineage.hints || [];
  const specialHint = currentSession.lineage.specialHint;
  const config = getGlobalConfig();

  let html = '';

  // 1. เรนเดอร์คำใบ้ปกติ
  if (hints.length === 0) {
    html = '<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center;">พี่รหัสยังไม่ได้ให้คำใบ้ใดๆ เลย...</p>';
  } else {
    html = hints.map((hint, idx) => `
      <div class="hint-item">
        <div class="hint-number">คำใบ้ที่ #${idx + 1}</div>
        <div class="hint-text">${escapeHtml(hint)}</div>
      </div>
    `).join('');
  }

  // 2. เรนเดอร์คำใบ้พิเศษ
  if (specialHint) {
    if (currentSession.lineage.specialHintRevealed) {
      html += `
        <div class="hint-item special-hint" style="margin-top: 15px;">
          <div class="hint-number">⭐ คำใบ้พิเศษ (เปิดเผยแล้ว)</div>
          <div class="hint-text" style="font-weight: 500; white-space: pre-wrap;">${escapeHtml(specialHint)}</div>
        </div>
      `;
    } else {
      html += `
        <div class="hint-item special-hint locked" style="margin-top: 15px;">
          <div class="hint-number">🔒 คำใบ้พิเศษ</div>
          <div class="hint-text" style="color: var(--text-muted); font-style: italic;">รอพี่รหัสเปิดเผยคำใบ้นี้ให้คุณ...</div>
        </div>
      `;
    }
  }

  container.innerHTML = html;
}

function renderJuniorSeniorCardDetails() {
  const container = document.getElementById('reveal-card-back');
  if (!container) return;

  const senior = currentSession.lineage.senior;
  container.innerHTML = `
    <div class="senior-avatar">${senior.avatar || '🦊'}</div>
    <h4>🎉 เฉลยแล้ว! 🎉</h4>
    <div style="font-size: 1.1rem; font-weight: 600; color: var(--accent-gold); margin-bottom: 12px;">
      ${senior.name}
    </div>
    <div class="senior-info-item">
      <span class="label">สาขาวิชา:</span>
      <span>${senior.major}</span>
    </div>
  `;
}

// ---------------------------------
// SENIOR DASHBOARD RENDERING
// ---------------------------------
function renderSeniorDashboard(user, lineage) {
  const dashboard = document.getElementById('dashboard-section');

  const html = `
    <div class="dashboard-grid">
      <!-- คอลัมน์ซ้าย: ข้อมูลพี่รหัสและน้องรหัสคู่ชะตา -->
      <div class="info-panel">
        <div class="panel-title">
          <span>📋 ข้อมูลของฉัน</span>
        </div>
        <div class="user-profile-widget">
          <div class="user-avatar">${user.avatar || '🦊'}</div>
          <div class="user-details">
            <h3>${user.name}</h3>
            <p>รหัสนิสิต: ${user.id}</p>
            <p>สาขา: ${user.major}</p>
          </div>
        </div>

        <div class="panel-title">
          <span>👶 น้องรหัสในครอบครอง</span>
        </div>
        
        <!-- รายชื่อน้องรหัส (รองรับการมีน้องรหัส 2 คน) -->
        <div class="juniors-list ${lineage.juniors.length > 1 ? 'double' : ''}" id="juniors-list-container">
          <!-- ข้อมูลน้องรหัสจะถูกแทรกที่นี่ -->
        </div>

        <!-- แผงจัดการคำใบ้สำหรับน้องรหัส -->
        <div class="panel-title">
          <span>💡 จัดการคำใบ้ของฉัน</span>
        </div>
        <div class="hints-mgmt-container" style="margin-bottom: 20px;">
          <div class="hint-input-group">
            <input type="text" id="new-hint-input" class="input-control" placeholder="พิมพ์คำใบ้ใหม่สำหรับสายรหัส..." autocomplete="off">
            <button class="add-hint-btn" onclick="addNewHint()">เพิ่มคำใบ้</button>
          </div>
          <div class="hints-list" id="senior-hints-list" style="margin-top: 10px;">
            <!-- รายชื่อคำใบ้พร้อมปุ่มลบ -->
          </div>
        </div>

        <!-- แผงจัดการคำใบ้พิเศษ -->
        <div class="panel-title">
          <span>⭐ คำใบ้พิเศษ</span>
        </div>
        <div class="hints-mgmt-container" style="margin-bottom: 25px;">
          <div class="hint-input-group" style="flex-direction: column; align-items: stretch;">
            <textarea id="special-hint-input" class="input-control textarea-control" placeholder="พิมพ์แก้ไขคำใบ้พิเศษ..." rows="3" style="resize: vertical; margin-bottom: 10px;">${escapeHtml(lineage.specialHint || '')}</textarea>
            <button class="add-hint-btn" onclick="updateSpecialHint()" style="background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%); align-self: flex-end;">บันทึก</button>
          </div>
          
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
            ${(currentSession.config && currentSession.config.adminAllowSpecialHint) ? `
              <label style="display: flex; align-items: center; gap: 8px; color: #fff; cursor: pointer;">
                <input type="checkbox" id="senior-toggle-special" ${lineage.specialHintRevealed ? 'checked' : ''} onchange="toggleSpecialHintBySenior(this.checked)">
                เปิดเผยคำใบ้พิเศษให้น้องเห็น
              </label>
            ` : `
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">🔒 แอดมินยังไม่อนุญาตให้เปิดเผยคำใบ้พิเศษ</p>
            `}
          </div>
        </div>

        <button class="logout-btn" onclick="showChangePasswordModal(false)" style="margin-right: 10px; margin-bottom: 10px;">🔑 เปลี่ยนรหัสผ่าน</button>
        <button class="logout-btn" onclick="handleLogout()">ออกจากระบบ</button>
      </div>

      <!-- คอลัมน์ขวา: ห้องแชทสายรหัส -->
      <div class="content-panel">
        <div class="panel-title">
          <span>💬 ห้องแชทสายรหัส</span>
        </div>
        <div class="lineage-chat-wrapper" style="display: flex; gap: 15px; align-items: stretch; height: 500px;">
          ${lineage.juniors.length > 1 ? `
          <div class="chat-sidebar" style="width: 220px; background: rgba(0,0,0,0.2); border-radius: 15px; padding: 15px; display: flex; flex-direction: column; gap: 10px; border: 1px solid rgba(255,255,255,0.05); overflow-y: auto;">
            <h4 style="color: var(--accent-gold); font-size: 0.9rem; margin-bottom: 5px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">👥 รายชื่อห้องแชท</h4>
            <button class="chat-sidebar-btn active" id="tab-lineage-group" onclick="switchLineageRoom('group')">💬 แชทกลุ่ม</button>
            ${lineage.juniors.map(j => `<button class="chat-sidebar-btn" id="tab-lineage-${j.id}" onclick="switchLineageRoom('${j.id}')">👤 น้อง ${j.name.split(' ')[0]}</button>`).join('')}
          </div>
          ` : ''}

          <div class="chat-container" style="flex: 1; height: 100%; border-radius: ${lineage.juniors.length > 1 ? '15px' : '15px'};">
            <div class="chat-header">
              <div class="chat-title-group">
                <h4 id="chat-room-title">แชทคุยกับน้องรหัส</h4>
                <p><span class="online-badge"></span> แชทกลุ่มสายรหัสสมาชิก ${lineage.juniors.length + 1} คน (แสดงชื่อจริงของน้องๆ)</p>
              </div>
            </div>
            <div class="mission-bar" style="margin: 0 15px 15px 15px;">
              <div class="mission-bar-header">
                <span class="mission-title">⭐ ภารกิจสายรหัส: ส่งข้อความรับ 1 ดาว</span>
                <span class="mission-progress-text" id="lineage-mission-progress-text">0/5 ข้อความ</span>
              </div>
              <div class="mission-progress-bg">
                <div class="mission-progress-fill" id="lineage-mission-progress-fill" style="width: 0%"></div>
              </div>
            </div>
            <div class="chat-messages" id="chat-messages-box">
              <!-- ข้อความแชท -->
            </div>
            <div id="lineage-typing-indicator" class="typing-indicator"></div>
            <div class="chat-input-area">
              <input type="text" id="chat-input-field" class="chat-input" placeholder="พิมพ์ข้อความถึงน้องๆ..." autocomplete="off">
              <button class="send-msg-btn" id="send-msg-btn">✈️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  dashboard.innerHTML = html;

  renderSeniorJuniorsList();
  renderSeniorHintsList();
  renderChatMessages();
  if (typeof updateLineageMissionBar === 'function') updateLineageMissionBar();

  // ตั้งค่าปุ่มส่งข้อความ
  setupChatSubmit();
}

function renderSeniorJuniorsList() {
  const container = document.getElementById('juniors-list-container');
  if (!container) return;

  const juniors = currentSession.lineage.juniors;

  container.innerHTML = juniors.map(jun => `
    <div class="junior-card">
      <div class="junior-avatar-sm">${jun.avatar || '🐰'}</div>
      <div class="junior-card-details">
        <h4>${jun.name}</h4>
        <p style="margin-bottom: 5px;">สาขา: ${jun.major}</p>
        ${jun.ig ? `<p style="color: var(--primary-teal); font-size: 0.85rem; font-weight: 500; display: inline-flex; align-items: center; gap: 4px; background: rgba(29, 233, 182, 0.1); padding: 2px 8px; border-radius: 4px; margin-bottom: 5px;">📸 IG: ${jun.ig}</p>` : ''}
        <p style="font-size: 0.85rem; color: var(--accent-orange); background: rgba(255,183,3,0.1); padding: 2px 8px; border-radius: 4px; display: inline-flex; margin-top: 5px;">🎁 ชอบ: ${jun.favorites || 'ยังไม่ได้ระบุ'}</p>
      </div>
    </div>
  `).join('');
}

function renderSeniorHintsList() {
  const container = document.getElementById('senior-hints-list');
  if (!container) return;

  const hints = currentSession.lineage.hints;
  if (!hints || hints.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 15px;">ยังไม่มีคำใบ้ที่คุณสร้างไว้เลย</p>';
    return;
  }

  container.innerHTML = hints.map((hint, idx) => `
    <div class="senior-hint-item">
      <div style="flex: 1;">
        <div class="hint-number" style="margin-bottom: 2px;">คำใบ้ที่ #${idx + 1}</div>
        <div class="hint-text" style="font-size: 0.9rem;">${escapeHtml(hint)}</div>
      </div>
      <button class="delete-hint-btn" onclick="deleteHint(${idx})" title="ลบคำใบ้นี้">🗑️</button>
    </div>
  `).join('');
}

// ฟังก์ชันเพิ่มคำใบ้ใหม่ (ฝั่งพี่รหัส)
function addNewHint() {
  const input = document.getElementById('new-hint-input');
  if (!input) return;

  const value = input.value.trim();
  if (!value) return;

  const lineages = getLineages();
  const index = lineages.findIndex(l => l.id === currentSession.lineage.id);

  if (index !== -1) {
    lineages[index].hints.push(value);
    saveLineages(lineages);

    // อัปเดตข้อมูลบน Cloudflare Server
    apiAddHint(currentSession.lineage.id, value);

    // อัปเดต session ปัจจุบัน
    currentSession.lineage = lineages[index];
    sessionStorage.setItem('stat_session', JSON.stringify(currentSession));

    // เคลียร์ input และเรนเดอร์ใหม่
    input.value = '';
    renderSeniorHintsList();
  }
}

// ฟังก์ชันล้างหรือลบคำใบ้ (ฝั่งพี่รหัส)
function deleteHint(idx) {
  if (!confirm("คุณต้องการลบคำใบ้นี้ใช่หรือไม่?")) return;

  const lineages = getLineages();
  const index = lineages.findIndex(l => l.id === currentSession.lineage.id);

  if (index !== -1) {
    lineages[index].hints.splice(idx, 1);
    saveLineages(lineages);

    // ลบบน Cloudflare Server
    apiDeleteHint(currentSession.lineage.id, idx);

    // อัปเดต session ปัจจุบัน
    currentSession.lineage = lineages[index];
    sessionStorage.setItem('stat_session', JSON.stringify(currentSession));

    renderSeniorHintsList();
  }
}

async function updateSpecialHint() {
  const specialHint = document.getElementById('special-hint-input').value.trim();
  const btn = document.querySelector('.add-hint-btn');
  btn.textContent = '...';

  try {
    const res = await fetch("/api/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateSpecialHint", lineageId: currentSession.lineage.id, specialHintText: specialHint })
    });

    if (res.ok) {
      currentSession.lineage.specialHint = specialHint;
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      alert("บันทึกคำใบ้พิเศษแล้ว");
    } else {
      alert("เกิดข้อผิดพลาด");
    }
  } catch (e) {
    alert("ปัญหาการเชื่อมต่อ");
  } finally {
    btn.textContent = 'บันทึก';
  }
}

async function toggleSpecialHintBySenior(revealed) {
  try {
    const res = await fetch("/api/toggle-special-hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineageId: currentSession.lineage.id, revealed, userId: currentSession.user.id })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "ไม่สามารถเปิดเผยคำใบ้พิเศษได้");
      document.getElementById('senior-toggle-special').checked = !revealed;
    } else {
      currentSession.lineage.specialHintRevealed = revealed;
      if (revealed) {
        currentSession.user.stars -= 20; // หักดาวในฝั่งลูกข่ายให้ตรงกับเซิร์ฟเวอร์
        updateDashboardStars(currentSession.user.stars);
      }
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาด");
  }
}

// ---------------------------------
// CHAT FUNCTIONALITY
// ---------------------------------
function renderChatMessages() {
  const box = document.getElementById('chat-messages-box');
  if (!box) return;

  // Show loading placeholder - actual messages will be loaded via WebSocket fetchRoomMessages
  box.innerHTML = `
    <div style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-top: 40px;">
      💬 กำลังโหลดข้อความ...
    </div>
  `;
}

// คำสั่ง Bulk Action ของแอดมิน
window.adminBulkAction = async function(actionType) {
  if (actionType === 'reveal_lineages') {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะ 'เฉลยสายรหัสทั้งหมด' ทันที? (การกระทำนี้ส่งผลต่อทุกคน)")) return;
  } else if (actionType === 'reveal_special_hints') {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะ 'เปิดคำใบ้พิเศษ' ให้น้องทุกคนเห็นฟรีๆ ทันที?")) return;
  }

  try {
    const res = await fetch("/api/admin-bulk-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adminId: currentSession.user.id,
        action: actionType
      })
    });
    
    if (res.ok) {
      // ส่งสัญญาณให้ทุกคนรีเฟรชหรืออัปเดตหน้าจอทันที
      if (typeof globalWs !== 'undefined' && globalWs && globalWs.readyState === WebSocket.OPEN) {
        globalWs.send(JSON.stringify({
          type: 'admin_bulk_action',
          action: actionType
        }));
      }
      alert("ทำรายการสำเร็จ! หน้าจอของผู้ใช้ทั้งหมดกำลังถูกอัปเดต");
      fetchLineages(); // ให้แอดมินโหลดข้อมูลใหม่เองด้วย
    } else {
      const err = await res.json();
      alert("เกิดข้อผิดพลาด: " + err.error);
    }
  } catch (err) {
    alert("เชื่อมต่อขัดข้อง");
  }
}

function setupChatSubmit() {
  const btn = document.getElementById('send-msg-btn');
  const input = document.getElementById('chat-input-field');

  if (!btn || !input) return;

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;

    // ลองส่งผ่าน WebSocket ก่อน
    if (typeof sendLineageMessage === 'function' && sendLineageMessage(text)) {
      input.value = '';
      // หยุด typing indicator
      if (typeof sendLineageTyping === 'function') sendLineageTyping(false);
      return;
    }

    // Fallback: ส่งผ่าน API แบบเดิม
    const lineages = getLineages();
    const index = lineages.findIndex(l => l.id === currentSession.lineage.id);

    if (index !== -1) {
      const newMsg = {
        senderId: currentSession.user.id,
        senderName: currentSession.user.name,
        senderRole: currentSession.role,
        text: text,
        timestamp: new Date().toISOString()
      };

      lineages[index].messages.push(newMsg);
      saveLineages(lineages);
      apiSendMessage(currentSession.lineage.id, newMsg.senderId, newMsg.senderName, newMsg.senderRole, newMsg.text);
      currentSession.lineage = lineages[index];
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));

      input.value = '';
      renderChatMessages();
    }
  };

  btn.onclick = sendMessage;
  input.onkeypress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  // Lineage typing indicator
  input.oninput = () => {
    if (typeof sendLineageTyping === 'function') {
      sendLineageTyping(true);
      clearTimeout(lineageTypingTimeout);
      lineageTypingTimeout = setTimeout(() => {
        if (typeof sendLineageTyping === 'function') sendLineageTyping(false);
      }, 2000);
    }
  };
}

// ---------------------------------
// DEV TOOLS PANEL (แผงควบคุมผู้พัฒนา)
// ---------------------------------
function renderDevTools() {
  const container = document.getElementById('dev-quick-links-container');
  const revealContainer = document.getElementById('dev-reveal-container');
  if (!container || !revealContainer) return;

  const lineages = getLineages();

  // 1. เรนเดอร์ปุ่มทางลัดเข้าสู่ระบบด่วน
  let seniorHtml = '<div style="margin-bottom: 15px;"><div style="color: var(--secondary-teal); font-size: 0.85rem; margin-bottom: 5px;">👑 ส่วนของพี่รหัส</div>';
  let juniorHtml = '<div><div style="color: var(--secondary-teal); font-size: 0.85rem; margin-bottom: 5px;">👶 ส่วนของน้องรหัส</div>';

  lineages.forEach(lin => {
    const juniorNames = lin.juniors.map(j => j.name.split(' ')[0]).join(', ');

    // พี่รหัส
    seniorHtml += `
      <button class="dev-btn" onclick="devLogin('senior', '${lin.senior.email}', '${lin.senior.id}')">
        <span>🔑 ${lin.senior.name.split(' ')[0]} <span style="font-size:0.75rem; color:var(--text-muted);">(พี่รหัสของ ${juniorNames})</span></span>
      </button>
    `;

    // น้องรหัส
    lin.juniors.forEach(jun => {
      juniorHtml += `
        <button class="dev-btn" onclick="devLogin('junior', '${jun.email}', '${jun.id}')">
          <span>🔑 ${jun.name.split(' ')[0]} <span style="font-size:0.75rem; color:var(--text-muted);">(น้องรหัสของ ${lin.senior.name.split(' ')[0]})</span></span>
        </button>
      `;
    });
  });

  seniorHtml += '</div>';
  juniorHtml += '</div>';

  container.innerHTML = seniorHtml + juniorHtml;

  // 2. เรนเดอร์ตัวเลือกเฉลยสายรหัส (Toggle Switch)
  let revealHtml = '';
  lineages.forEach(lin => {
    const title = lin.juniors.map(j => j.name.split(' ')[0]).join(' & ');
    revealHtml += `
      <div class="dev-reveal-row">
        <span>เฉลยสายรหัสของ ${title}</span>
        <label class="switch">
          <input type="checkbox" id="dev-toggle-reveal-${lin.id}" ${lin.revealed ? 'checked' : ''} onchange="devToggleReveal('${lin.id}')">
          <span class="slider"></span>
        </label>
      </div>
    `;
  });

  revealContainer.innerHTML = revealHtml;

  // 3. ซิงค์ค่าของคำใบ้พิเศษและระบบทายของแอดมิน
  const config = getGlobalConfig();
  const specialHintCheckbox = document.getElementById('dev-toggle-special-hints');
  const guessingCheckbox = document.getElementById('dev-toggle-guessing');
  if (specialHintCheckbox) specialHintCheckbox.checked = config.specialHintsRevealed;
  if (guessingCheckbox) guessingCheckbox.checked = config.guessingEnabled;
}

// ฟังก์ชันล็อกอินทางลัดสำหรับผู้พัฒนา
async function devLogin(role, email, id) {
  // บังคับเปลี่ยนตัวเลือกปุ่ม Role ในหน้าล็อกอินหากอยู่นอกระบบ
  const btn = document.querySelector(`.role-btn[data-role="${role}"]`);
  if (btn) btn.click();

  try {
    const res = await fetch("/api/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, email })
    });

    if (res.ok) {
      const result = await res.json();
      currentSession = result;
      sessionStorage.setItem('stat_session', JSON.stringify(result));

      // ล้างและแสดงผลหน้า Dashboard ใหม่
      renderDashboard();

      // ปิดลิ้นชักแถบเครื่องมือด่วน
      document.getElementById('dev-drawer').classList.remove('open');
    }
  } catch (err) {
    console.error("Error in dev login:", err);
  }
}

// ฟังก์ชันเปิด/ปิด การเฉลยสายรหัสจากแผงควบคุมแอดมิน
function devToggleReveal(lineageId) {
  const lineages = getLineages();
  const index = lineages.findIndex(l => l.id === lineageId);

  if (index !== -1) {
    const isChecked = document.getElementById(`dev-toggle-reveal-${lineageId}`).checked;
    lineages[index].revealed = isChecked;
    saveLineages(lineages);

    // ส่งข้อมูลไป Cloudflare Server
    apiToggleReveal(lineageId, isChecked);

    // อัปเดตข้อมูล Session ปัจจุบันหากสายรหัสกำลังทำงานอยู่
    if (currentSession && currentSession.lineage.id === lineageId) {
      currentSession.lineage.revealed = isChecked;
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));

      // ถ้าน้องล็อกอินอยู่ ให้เล่นเอฟเฟกต์/เปลี่ยนหน้ารูปทันที
      if (currentSession.role === 'junior') {
        const cardInner = document.getElementById('reveal-card-inner');
        if (isChecked && cardInner && !cardInner.classList.contains('flipped')) {
          cardInner.classList.add('flipped');
          startConfetti();
          renderJuniorSeniorCardDetails();
        } else if (!isChecked && cardInner && cardInner.classList.contains('flipped')) {
          cardInner.classList.remove('flipped');
        }
      }
    }

    // เรนเดอร์ส่วนแผงควบคุมการเฉลยใน Dev Tools ซ้ำ (เพื่อให้ค่า sync กัน)
    renderDevTools();
  }
}

// ฟังก์ชันเปิด/ปิด การเฉลยสายรหัสทั้งหมดพร้อมกัน
function devRevealAll(status) {
  const lineages = getLineages();
  lineages.forEach(lin => {
    lin.revealed = status;
    // ส่งข้อมูลไป Cloudflare Server
    apiToggleReveal(lin.id, status);
  });
  saveLineages(lineages);

  // อัปเดตข้อมูล Session ปัจจุบันถ้าล็อกอินอยู่
  if (currentSession) {
    const updatedLin = lineages.find(l => l.id === currentSession.lineage.id);
    if (updatedLin) {
      currentSession.lineage = updatedLin;
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));

      // ถ้าน้องล็อกอินอยู่ ให้เล่นเอฟเฟกต์/เปลี่ยนหน้ารูปทันที
      if (currentSession.role === 'junior') {
        const cardInner = document.getElementById('reveal-card-inner');
        if (status && cardInner && !cardInner.classList.contains('flipped')) {
          cardInner.classList.add('flipped');
          startConfetti();
          renderJuniorSeniorCardDetails();
        } else if (!status && cardInner && cardInner.classList.contains('flipped')) {
          cardInner.classList.remove('flipped');
        }
      }
    }
  }

  // เรนเดอร์ Dev Tools และหน้าจอใหม่เพื่ออัปเดตสถานะปุ่ม
  renderDevTools();
}

// ฟังก์ชันช่วยเข้ารหัส HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ฟังก์ชันสำหรับแอดมินในการสลับ เปิด/ปิด การแสดงคำใบ้พิเศษ
function devToggleSpecialHintsGlobal() {
  const checkbox = document.getElementById('dev-toggle-special-hints');
  if (!checkbox) return;

  const config = getGlobalConfig();
  config.specialHintsRevealed = checkbox.checked;
  saveGlobalConfig(config);

  // อัปเดตคอนฟิกบน Cloudflare Server
  apiSaveConfig({ specialHintsRevealed: checkbox.checked });

  // อัปเดตการเรนเดอร์ในหน้า Dashboard ฝั่งน้อง
  if (currentSession && currentSession.role === 'junior') {
    renderJuniorHints();
  }
}

// ฟังก์ชันสำหรับแอดมินในการสลับ เปิด/ปิด ระบบทายสายรหัส
function devToggleGuessingGlobal() {
  const checkbox = document.getElementById('dev-toggle-guessing');
  if (!checkbox) return;

  const config = getGlobalConfig();
  config.guessingEnabled = checkbox.checked;
  saveGlobalConfig(config);

  // อัปเดตคอนฟิกบน Cloudflare Server
  apiSaveConfig({ guessingEnabled: checkbox.checked });

  // อัปเดตการเรนเดอร์ในหน้า Dashboard ฝั่งน้อง
  if (currentSession && currentSession.role === 'junior') {
    renderJuniorGuessingPanel();
  }
}

// ฟังก์ชันเรนเดอร์กล่องทายสายรหัสฝั่งน้อง
function renderJuniorGuessingPanel() {
  const container = document.getElementById('junior-guessing-container');
  if (!container) return;

  const lineage = currentSession.lineage;
  const config = getGlobalConfig();

  // หากเฉลยแล้ว ไม่ต้องให้เดา
  if (lineage.revealed) {
    container.innerHTML = `
      <div class="guessing-panel" style="border-color: var(--secondary-teal); background: rgba(29, 233, 182, 0.05); text-align: center;">
        <div class="guessing-title" style="justify-content: center; color: var(--secondary-teal); margin-bottom: 5px;">🎉 ทายตัวตนสำเร็จแล้ว!</div>
        <p style="font-size: 0.9rem; color: var(--text-light); margin: 0;">คุณได้เฉลยตัวตนพี่รหัสเรียบร้อยแล้ว!</p>
      </div>
    `;
    return;
  }

  // หากระบบยังไม่เปิดให้ทาย
  if (!config.guessingEnabled) {
    container.innerHTML = `
      <div class="guessing-panel locked">
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0; line-height: 1.4;">🗳️ ระบบทายชื่อยังไม่เปิดให้ใช้งาน<br>(จะเปิดให้เล่นทายร่วมกันในวันงานกิจกรรม)</p>
      </div>
    `;
    return;
  }

  // ดึงรายชื่อพี่รหัสและสาขาทั้งหมดมาเป็นตัวเลือก
  const lineages = getLineages();
  const seniorNames = lineages.map(l => l.senior.name).sort();
  const majors = [...new Set(lineages.map(l => l.senior.major))].sort();

  // เช็คว่าผ่านด่านสาขาแล้วหรือยัง
  const passedMajor = localStorage.getItem('stat_passed_major') === 'true';
  const cooldownEnd = parseInt(localStorage.getItem('stat_major_cooldown') || '0', 10);
  const now = Date.now();
  const inCooldown = now < cooldownEnd;

  if (passedMajor) {
    container.innerHTML = `
      <div class="guessing-panel">
        <div class="guessing-title">🗳️ ทายชื่อพี่รหัส (ขั้นสุดท้าย)</div>
        <div class="guess-form">
          <select id="guess-senior-name" class="guess-select">
            <option value="" disabled selected>-- เลือกทายชื่อพี่รหัส --</option>
            ${seniorNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}
          </select>
          <button onclick="submitGuessName()" class="guess-submit-btn">ส่งคำตอบ</button>
        </div>
      </div>
    `;
  } else {
    let cooldownHtml = '';
    let btnDisabled = '';
    if (inCooldown) {
      btnDisabled = 'disabled style="opacity:0.5;cursor:not-allowed;"';
      cooldownHtml = '<div class="countdown-timer" id="major-countdown">รอให้ครบ 1 นาทีก่อนทายใหม่...</div>';
      // เริ่มตัวจับเวลา
      setTimeout(updateCooldownTimer, 1000);
    }

    container.innerHTML = `
      <div class="guessing-panel">
        <div class="guessing-title">🗳️ ทายสาขาวิชา (ด่านที่ 1)</div>
        <div class="guess-form">
          <select id="guess-senior-major" class="guess-select" ${btnDisabled}>
            <option value="" disabled selected>-- เลือกทายสาขาวิชา --</option>
            ${majors.map(maj => `<option value="${escapeHtml(maj)}">${escapeHtml(maj)}</option>`).join('')}
          </select>
          <button onclick="submitGuessMajor()" id="btn-guess-major" class="guess-submit-btn" ${btnDisabled}>ส่งคำตอบสาขา</button>
          ${cooldownHtml}
        </div>
      </div>
    `;
  }
}

function updateCooldownTimer() {
  const cooldownEnd = parseInt(localStorage.getItem('stat_major_cooldown') || '0', 10);
  const now = Date.now();
  const diff = Math.ceil((cooldownEnd - now) / 1000);
  const el = document.getElementById('major-countdown');

  if (diff <= 0) {
    renderJuniorGuessingPanel();
  } else if (el) {
    el.textContent = `รออีก ${diff} วินาทีก่อนทายใหม่...`;
    setTimeout(updateCooldownTimer, 1000);
  }
}

async function submitGuessMajor() {
  const majorSelect = document.getElementById('guess-senior-major');
  if (!majorSelect || !majorSelect.value) {
    alert("กรุณาเลือกสาขาวิชา");
    return;
  }

  const guessedMajor = majorSelect.value;
  
  try {
    const res = await fetch("/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineageId: currentSession.lineage.id,
        type: "major",
        guess: guessedMajor
      })
    });
    
    if (!res.ok) {
      alert("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
      return;
    }
    
    const data = await res.json();
    
    if (data.correct) {
      alert("🎉 ทายสาขาวิชาถูกต้อง! ไปทายชื่อพี่รหัสกันต่อเลย!");
      localStorage.setItem('stat_passed_major', 'true');
      renderJuniorGuessingPanel();
    } else {
      alert("❌ ทายสาขาวิชาผิด! ต้องรอ 1 นาทีก่อนจะทายใหม่ได้นะ");
      localStorage.setItem('stat_major_cooldown', Date.now() + 60000);
      renderJuniorGuessingPanel();
    }
  } catch(err) {
    alert("การเชื่อมต่อมีปัญหา กรุณาลองใหม่");
  }
}

// ฟังก์ชันส่งคำตอบทายชื่อพี่รหัสฝั่งน้อง (ขั้นสุดท้าย)
async function submitGuessName() {
  const nameSelect = document.getElementById('guess-senior-name');
  if (!nameSelect || !nameSelect.value) {
    alert("กรุณาเลือกทายชื่อพี่รหัส");
    return;
  }

  const guessedName = nameSelect.value;

  try {
    const res = await fetch("/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineageId: currentSession.lineage.id,
        type: "name",
        guess: guessedName
      })
    });
    
    if (!res.ok) {
      alert("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
      return;
    }
    
    const data = await res.json();
    
    if (data.correct) {
      // ทายถูก!
      const actualSenior = data.senior; // ได้รับข้อมูลเต็มๆ จากเซิร์ฟเวอร์
      
      // 1. อัปเดตฐานข้อมูล
      const lineages = getLineages();
      const idx = lineages.findIndex(l => l.id === currentSession.lineage.id);
      if (idx !== -1) {
        lineages[idx].revealed = true;
        // ใส่ senior เต็มรูปแบบกลับเข้าไป
        lineages[idx].senior = actualSenior;
        saveLineages(lineages);

        // อัปเดตเซสชัน
        currentSession.lineage = lineages[idx];
        sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      }

      // 2. แสดง Congratulations Modal
      const modal = document.getElementById('congrats-modal');
      const detailsBox = document.getElementById('congrats-senior-details');
      const closeBtn = document.getElementById('congrats-close-btn');

      if (detailsBox) {
        detailsBox.innerHTML = `
          <div style="font-size: 1.4rem; margin-bottom: 5px;">${actualSenior.avatar || '🦊'} ${actualSenior.name}</div>
          <div style="font-size: 0.95rem; font-weight: normal; color: var(--text-muted);">
            สาขาวิชา: ${actualSenior.major}
          </div>
        `;
      }

      if (modal) {
        modal.classList.add('open');
      }

      // พลุกระดาษเฉลิมฉลอง
      startConfetti();

      // ปุ่มปิดเพื่อรีโหลดแดชบอร์ด
      if (closeBtn) {
        closeBtn.onclick = () => {
          modal.classList.remove('open');
          renderDashboard();
        };
      }
    } else {
      // ทายผิด
      alert("คำตอบยังไม่ถูกต้อง ลองสืบหาเบาะแสเพิ่มเติมแล้วลองใหม่อีกครั้งนะค๊าบ! 🥺");
    }
  } catch(err) {
    alert("การเชื่อมต่อมีปัญหา กรุณาลองใหม่");
  }
}

// Removed duplicate updateSpecialHint

// ----------------------------------------------------
// ระบบเปลี่ยนรหัสผ่าน
// ----------------------------------------------------
let forceChangePassword = false;

function showChangePasswordModal(force = false) {
  forceChangePassword = force;
  document.getElementById('password-modal').style.display = 'flex';

  const avatarGroup = document.getElementById('avatar-form-group');
  const avatarInput = document.getElementById('user-avatar-input');

  if (force) {
    document.getElementById('close-password-modal').style.display = 'none';
    if (avatarGroup) {
      if (currentSession && currentSession.role === 'admin') {
        avatarGroup.style.display = 'none';
        if (avatarInput) avatarInput.required = false;
      } else {
        avatarGroup.style.display = 'block';
        if (avatarInput) avatarInput.required = true;
      }
    }
  } else {
    document.getElementById('close-password-modal').style.display = 'flex';
    if (avatarGroup) avatarGroup.style.display = 'none';
    if (avatarInput) avatarInput.required = false;
  }
}

document.getElementById('close-password-modal').addEventListener('click', () => {
  document.getElementById('password-modal').style.display = 'none';
});

document.getElementById('change-password-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const oldPw = document.getElementById('old-password').value;
  const newPw = document.getElementById('new-password').value;
  const confirmPw = document.getElementById('confirm-password').value;

  if (newPw !== confirmPw) {
    alert("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
    return;
  }

  const btn = e.target.querySelector('.submit-btn');
  const originalTxt = btn.textContent;
  btn.textContent = 'กำลังบันทึก...';
  btn.disabled = true;

  const avatarInput = document.getElementById('user-avatar-input');
  const avatar = forceChangePassword && avatarInput ? avatarInput.value.trim() : null;

  try {
    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentSession.user.id, currentPassword: oldPw, newPassword: newPw, avatar: avatar })
    });

    const data = await res.json();
    if (res.ok) {
      alert("เปลี่ยนรหัสผ่านสำเร็จ!");
      document.getElementById('password-modal').style.display = 'none';
      document.getElementById('change-password-form').reset();

      // อัปเดต session ว่าเปลี่ยนรหัสผ่านแล้ว
      currentSession.user.hasChangedPassword = true;
      if (avatar) currentSession.user.avatar = avatar;
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));

      if (forceChangePassword) {
        if (currentSession.role === 'senior' && !currentSession.user.hasSeenRoulette) {
          showRouletteModal();
        } else {
          renderDashboard();
        }
      }
    } else {
      alert(data.error || "เกิดข้อผิดพลาด");
    }
  } catch (err) {
    alert("การเชื่อมต่อมีปัญหา กรุณาลองใหม่");
  } finally {
    btn.textContent = originalTxt;
    btn.disabled = false;
  }
});

// ----------------------------------------------------
// ระบบตั้งค่าแอดมิน (Admin Dashboard)
// ----------------------------------------------------
async function renderAdminDashboard() {
  const dashboard = document.getElementById('dashboard-section');
  dashboard.innerHTML = `
    <div class="glass-panel" style="max-width: 1000px; margin: 0 auto; text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="color: var(--accent-gold); font-family: 'Prompt', sans-serif;">🛠️ แผงควบคุมผู้ดูแลระบบ</h2>
        <div style="display: flex; gap: 10px;">
          <button class="dev-btn" onclick="toggleDevDrawer()" style="padding: 8px 15px; font-size: 0.9rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; cursor: pointer; color: white;">👨‍💻 Dev Tools</button>
          <button class="logout-btn" onclick="handleLogout()">ออกจากระบบ</button>
        </div>
      </div>
      
      <div style="margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 15px; align-items: center; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px;">
        <h4 style="color: #fff; margin: 0; width: 100%;">ตั้งค่าส่วนกลาง:</h4>
        <label style="display: flex; align-items: center; gap: 8px; color: #fff; cursor: pointer;">
          <input type="checkbox" id="admin-allow-special" ${(currentSession.config && currentSession.config.adminAllowSpecialHint) ? 'checked' : ''} onchange="toggleAdminAllowSpecial(this.checked)">
          อนุญาตให้พี่รหัสเปิดคำใบ้พิเศษ
        </label>
        <label style="display: flex; align-items: center; gap: 8px; color: #fff; cursor: pointer;">
          <input type="checkbox" id="admin-allow-guessing" ${(currentSession.config && currentSession.config.guessingEnabled) ? 'checked' : ''} onchange="toggleAdminConfig('guessing_enabled', this.checked)">
          เปิดระบบให้น้องรหัสเริ่มทาย
        </label>
        <label style="display: flex; align-items: center; gap: 8px; color: #fff; cursor: pointer;">
          <div class="switch" style="width: 30px; height: 16px;">
            <input type="checkbox" id="admin-global-chat" ${(currentSession.config && currentSession.config.globalChatEnabled !== false) ? 'checked' : ''} onchange="toggleAdminConfig('global_chat_enabled', this.checked)">
            <span class="slider" style="border-radius: 16px;"></span>
          </div>
          เปิดใช้งานแชทโลก
        </label>
      </div>
      

      <!-- พี่รหัส -->
      <details style="margin-bottom: 20px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 12px;">
        <summary style="color: var(--accent-gold); font-size: 1.17em; font-weight: bold; cursor: pointer;">👑 รายชื่อพี่รหัส (กดเพื่อดู/ซ่อน)</summary>
        <div style="overflow-x: auto; margin-top: 15px;">
          <table class="admin-table" id="admin-seniors-table">
            <thead>
              <tr>
                <th>รหัสนิสิต</th>
                <th>ชื่อ</th>
                <th>สายรหัส</th>
                <th>น้องรหัส</th>
                <th>ดาว</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="4" style="text-align: center;">กำลังโหลดข้อมูล...</td></tr>
            </tbody>
          </table>
        </div>
      </details>

      <!-- น้องรหัส -->
      <details style="margin-bottom: 30px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 12px;">
        <summary style="color: var(--primary-teal); font-size: 1.17em; font-weight: bold; cursor: pointer;">🐰 รายชื่อน้องรหัส (กดเพื่อดู/ซ่อน)</summary>
        <div style="overflow-x: auto; margin-top: 15px;">
          <table class="admin-table" id="admin-juniors-table">
            <thead>
              <tr>
                <th>รหัสนิสิต</th>
                <th>ชื่อ</th>
                <th>สายรหัส</th>
                <th>พี่รหัส</th>
                <th>ดาว</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="6" style="text-align: center;">กำลังโหลดข้อมูล...</td></tr>
            </tbody>
          </table>
        </div>
      </details>

      <!-- คำสั่งแอดมินระดับสูง (Bulk Actions) -->
      <h3 style="color: #ff6b6b; margin-top: 30px; margin-bottom: 10px;">🚨 คำสั่งแอดมินระดับสูง</h3>
      <div style="background: rgba(255,107,107,0.1); padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid rgba(255,107,107,0.3);">
        <p style="color: #ff6b6b; margin-bottom: 15px; font-size: 0.9em;">⚠️ คำเตือน: การกดปุ่มเหล่านี้จะส่งผลต่อผู้ใช้ทุกคนในระบบทันที และไม่สามารถย้อนกลับได้ง่าย</p>
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <button onclick="adminBulkAction('reveal_special_hints')" class="dev-btn" style="background: rgba(255, 107, 107, 0.2); border: 1px solid #ff6b6b; color: #ff6b6b; justify-content: center; font-weight: bold; padding: 15px; font-size: 16px;">
            🔓 เปิดเผยคำใบ้พิเศษแก่น้องๆ ทุกคน (บังคับเปิด)
          </button>
          <button onclick="adminBulkAction('reveal_lineages')" class="dev-btn" style="background: rgba(255, 107, 107, 0.2); border: 1px solid #ff6b6b; color: #ff6b6b; justify-content: center; font-weight: bold; padding: 15px; font-size: 16px;">
            📢 เฉลยสายรหัสทั้งหมด (บังคับเฉลยทุกคน)
          </button>
        </div>
      </div>

      <!-- แจ้งปัญหา -->
      <h3 style="color: var(--accent-gold); margin-top: 30px; margin-bottom: 10px;">🐛 รายการแจ้งปัญหา</h3>
      <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; margin-bottom: 30px;">
        <button onclick="loadReports()" class="dev-btn" style="background: rgba(255,107,107,0.1); border-color: rgba(255,107,107,0.3); color: #ff6b6b; justify-content: center; width: 100%; margin-bottom: 15px;">
          🔄 โหลดรายการแจ้งปัญหาล่าสุด
        </button>
        <div id="admin-reports-list" style="display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto;">
          <p style="text-align:center; color:#888;">คลิกปุ่มเพื่อโหลดข้อมูลแจ้งปัญหา</p>
        </div>
      </div>
    </div>
  `;

  try {
    const res = await fetch(`/api/admin-get-users?adminId=${currentSession.user.id}`);
    const data = await res.json();
    if (res.ok) {
      window.adminDataCache = data;
      renderAdminUsersTable(data.users);
    } else {
      alert("โหลดข้อมูลล้มเหลว");
    }
  } catch (err) {
    console.error(err);
  }
}

function renderAdminUsersTable(users) {
  const seniorsTbody = document.querySelector('#admin-seniors-table tbody');
  const juniorsTbody = document.querySelector('#admin-juniors-table tbody');

  if (!seniorsTbody || !juniorsTbody) return;

  const seniors = users.filter(u => u.role === 'senior');
  const juniors = users.filter(u => u.role === 'junior');

  if (seniors.length === 0) {
    seniorsTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">ไม่มีข้อมูลพี่รหัส</td></tr>';
  } else {
    seniorsTbody.innerHTML = seniors.map(u => {
      const juniorNames = juniors.filter(j => j.lineage_id === u.lineage_id).map(j => j.name).join(', ') || '-';
      return `
      <tr>
        <td>${escapeHtml(u.id)}</td>
        <td>
          <span style="font-size: 1.2rem; margin-right: 5px;">${escapeHtml(u.avatar || '')}</span>
          ${escapeHtml(u.name)}
        </td>
        <td>${escapeHtml(u.lineage_id)}</td>
        <td style="font-size: 0.85rem; color: #aaa;">${escapeHtml(juniorNames)}</td>
        <td>⭐ ${u.stars || 0}</td>
        <td>
          <button class="primary-btn" style="padding: 5px 10px; font-size: 0.8rem; margin-top: 0;" onclick="editUserByAdmin('${u.id}')">แก้ไข</button>
        </td>
      </tr>
    `}).join('');
  }

  if (juniors.length === 0) {
    juniorsTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">ไม่มีข้อมูลน้องรหัส</td></tr>';
  } else {
    juniorsTbody.innerHTML = juniors.map(u => {
      const senior = seniors.find(s => s.lineage_id === u.lineage_id);
      const seniorName = senior ? senior.name : '-';
      return `
      <tr>
        <td>${escapeHtml(u.id)}</td>
        <td>
          <span style="font-size: 1.2rem; margin-right: 5px;">${escapeHtml(u.avatar || '')}</span>
          ${escapeHtml(u.name)}
        </td>
        <td>${escapeHtml(u.lineage_id)}</td>
        <td style="font-size: 0.85rem; color: #aaa;">${escapeHtml(seniorName)}</td>
        <td>⭐ ${u.stars || 0}</td>
        <td>
          <button class="primary-btn" style="padding: 5px 10px; font-size: 0.8rem; margin-top: 0;" onclick="editUserByAdmin('${u.id}')">แก้ไข</button>
        </td>
      </tr>
    `}).join('');
  }
}

async function toggleAdminConfig(key, value) {
  try {
    const res = await fetch("/api/admin-update-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: currentSession.user.id, key, value: value ? 'true' : 'false' })
    });
    if (!res.ok) {
      alert("ตั้งค่าไม่สำเร็จ");
      // Revert UI toggle
      if (key === 'guessing_enabled') {
        document.getElementById('admin-allow-guessing').checked = !value;
      }
      if (key === 'global_chat_enabled') {
        document.getElementById('admin-global-chat').checked = !value;
      }
    } else {
      if (!currentSession.config) currentSession.config = {};
      if (key === 'guessing_enabled') currentSession.config.guessingEnabled = value;
      if (key === 'global_chat_enabled') currentSession.config.globalChatEnabled = value;
      
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      
      if (typeof globalWs !== 'undefined' && globalWs && globalWs.readyState === WebSocket.OPEN) {
        globalWs.send(JSON.stringify({
          type: 'admin_config',
          key: key,
          value: value
        }));
      }
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
  }
}

async function toggleAdminAllowSpecial(allowed) {
  try {
    const res = await fetch("/api/admin-allow-special-hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: currentSession.user.id, allowed })
    });
    if (!res.ok) {
      alert("ตั้งค่าไม่สำเร็จ");
      document.getElementById('admin-allow-special').checked = !allowed;
    } else {
      currentSession.config.adminAllowSpecialHint = allowed;
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      
      // Broadcast over WebSocket so seniors get the update immediately
      if (typeof globalWs !== 'undefined' && globalWs && globalWs.readyState === WebSocket.OPEN) {
        globalWs.send(JSON.stringify({
          type: 'admin_config',
          key: 'admin_allow_special_hint',
          value: allowed ? 'true' : 'false'
        }));
      }
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
  }
}

window.editUserByAdmin = function (userId) {
  const user = window.adminDataCache.users.find(u => u.id === userId);
  if (!user) return;

  // เปิด Modal ฟอร์มแก้ไขแทน Prompt
  document.getElementById('admin-edit-userId').value = user.id;
  document.getElementById('admin-edit-name').value = user.name || '';
  document.getElementById('admin-edit-avatar').value = user.avatar || '';
  document.getElementById('admin-edit-ig').value = user.ig || '';
  document.getElementById('admin-edit-stars').value = user.stars || 0;
  document.getElementById('admin-edit-modal').style.display = 'flex';
}

// ----------------------------------------------------
// ระบบ Roulette (สุ่มน้องรหัส)
// ----------------------------------------------------
function showRouletteModal() {
  const modal = document.getElementById('roulette-modal');
  if (!modal) return;

  // \u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a\u0e27\u0e48\u0e32\u0e21\u0e35\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e19\u0e49\u0e2d\u0e07\u0e23\u0e2b\u0e31\u0e2a
  const juniors = (currentSession.lineage && currentSession.lineage.juniors) ? currentSession.lineage.juniors : [];
  if (juniors.length === 0) {
    renderDashboard();
    return;
  }

  modal.style.display = 'flex';
  let currentJuniorIndex = 0;

  const startBtn = document.getElementById('start-roulette-btn');
  const nextBtn = document.getElementById('next-roulette-btn');
  const closeBtn = document.getElementById('close-roulette-btn');
  const slots = document.getElementById('roulette-slots');

  if (!startBtn || !nextBtn || !closeBtn || !slots) {
    renderDashboard();
    return;
  }

  // \u0e23\u0e35\u0e40\u0e0b\u0e47\u0e15\u0e2a\u0e16\u0e32\u0e19\u0e30\u0e1b\u0e38\u0e48\u0e21
  startBtn.style.display = 'block';
  nextBtn.style.display = 'none';
  closeBtn.style.display = 'none';
  slots.innerHTML = '';

  startBtn.onclick = () => spinRoulette(juniors[currentJuniorIndex]);

  nextBtn.onclick = () => {
    currentJuniorIndex++;
    if (currentJuniorIndex < juniors.length) {
      startBtn.style.display = 'block';
      nextBtn.style.display = 'none';
      slots.innerHTML = '';
      slots.style.transform = 'translateY(0)';
      slots.style.transition = 'none';
      // \u0e1c\u0e39\u0e01\u0e1b\u0e38\u0e48\u0e21\u0e43\u0e2b\u0e21\u0e48\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e19\u0e49\u0e2d\u0e07\u0e04\u0e19\u0e15\u0e48\u0e2d\u0e44\u0e1b
      startBtn.onclick = () => spinRoulette(juniors[currentJuniorIndex]);
    }
  };

  closeBtn.onclick = async () => {
    modal.style.display = 'none';
    try {
      await fetch('/api/mark-roulette-seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentSession.user.id })
      });
      currentSession.user.hasSeenRoulette = true;
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
    } catch (e) { }
    renderDashboard();
  };

  function spinRoulette(targetJunior) {
    if (!targetJunior) {
      closeBtn.style.display = 'block';
      return;
    }
    startBtn.style.display = 'none';

    // \u0e2a\u0e23\u0e49\u0e32\u0e07\u0e23\u0e32\u0e22\u0e0a\u0e37\u0e48\u0e2d\u0e2b\u0e25\u0e2d\u0e01\u0e46
    const fakeNames = ["\u0e19\u0e49\u0e2d\u0e07\u0e2a\u0e21\u0e0a\u0e32\u0e22", "\u0e19\u0e49\u0e2d\u0e07\u0e2a\u0e21\u0e2b\u0e0d\u0e34\u0e07", "\u0e19\u0e49\u0e2d\u0e07\u0e21\u0e30\u0e25\u0e34", "\u0e19\u0e49\u0e2d\u0e07\u0e01\u0e25\u0e49\u0e27\u0e22\u0e2b\u0e2d\u0e21", "\u0e19\u0e49\u0e2d\u0e07\u0e41\u0e2d\u0e1b\u0e40\u0e1b\u0e34\u0e49\u0e25", "\u0e19\u0e49\u0e2d\u0e07\u0e0a\u0e32\u0e44\u0e02\u0e48\u0e21\u0e38\u0e01", "\u0e19\u0e49\u0e2d\u0e07\u0e2b\u0e21\u0e39\u0e01\u0e23\u0e2d\u0e1a", "\u0e19\u0e49\u0e2d\u0e07\u0e0a\u0e32\u0e1a\u0e39"];
    const totalItems = 30;

    let html = '';
    for (let i = 0; i < totalItems - 1; i++) {
      const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      html += `<div class="roulette-slot-item">${name}</div>`;
    }

    // \u0e0a\u0e37\u0e48\u0e2d\u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22\u0e2d\u0e22\u0e39\u0e48\u0e2a\u0e38\u0e14\u0e17\u0e49\u0e32\u0e22
    html += `<div class="roulette-slot-item target-item">${targetJunior.avatar || '🐰'} ${targetJunior.name}</div>`;
    html += `<div class="roulette-slot-item"></div>`;
    html += `<div class="roulette-slot-item"></div>`;

    slots.innerHTML = html;
    slots.style.transition = 'none';
    slots.style.transform = 'translateY(0)';
    void slots.offsetWidth;

    const targetY = -((totalItems - 1) * 40);
    slots.style.transition = 'transform 3.5s cubic-bezier(0.1, 0.7, 0.1, 1)';
    slots.style.transform = `translateY(${targetY}px)`;

    setTimeout(() => {
      const targetDiv = slots.querySelector('.target-item');
      if (targetDiv) targetDiv.classList.add('active');

      // ยิงพลุกระดาษ
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffb703', '#fb8500', '#219ebc', '#8ecae6']
        });
      }

      if (currentJuniorIndex < juniors.length - 1) {
        nextBtn.style.display = 'block';
      } else {
        closeBtn.style.display = 'block';
      }
    }, 3600);
  }
}

// ==============================================
// STREAK MODAL
// ==============================================
window.openStreakModal = function () {
  const modal = document.getElementById('streak-modal');
  if (modal) {
    modal.style.display = 'flex';
    renderStreakPath();
  }
};

window.closeStreakModal = function () {
  const modal = document.getElementById('streak-modal');
  if (modal) modal.style.display = 'none';
};

function renderStreakPath() {
  const container = document.getElementById('streak-path-container');
  if (!container || !currentSession) return;

  const streak = currentSession.user.loginStreak || 0;
  let html = '';

  for (let i = 1; i <= 45; i++) {
    const isBonusDay = (i % 5 === 0 && i < 45);
    const isFinalDay = (i === 45);
    const isActive = i <= streak;
    let bonusLabel = '+1';
    if (isFinalDay) bonusLabel = '+16';
    else if (isBonusDay) bonusLabel = '+6';

    html += `
      <div class="streak-node ${isBonusDay ? 'bonus' : ''} ${isFinalDay ? 'bonus final' : ''} ${isActive ? 'active' : ''}">
        <div class="streak-node-day">D${i}</div>
        <div class="streak-node-reward">⭐ ${bonusLabel}</div>
        ${isActive ? '<div style="position:absolute; top:-5px; right:-5px; font-size:12px;">✅</div>' : ''}
      </div>
    `;
  }

  container.innerHTML = html;
}

// ==============================================
// STAR HISTORY MODAL
// ==============================================
window.openStarHistoryModal = async function() {
  const modal = document.getElementById('star-history-modal');
  if (modal) modal.style.display = 'flex';
  
  const listContainer = document.getElementById('star-history-list');
  if (listContainer) listContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted);">กำลังโหลด...</p>';
  
  try {
    const res = await fetch(`/api/star-history?userId=${currentSession.user.id}`);
    if (res.ok) {
      const data = await res.json();
      const history = data.history || [];
      if (history.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted);">ยังไม่มีประวัติการได้รับดาว</p>';
      } else {
        listContainer.innerHTML = history.map(item => {
          const isPositive = item.amount > 0;
          const sign = isPositive ? '+' : '';
          const color = isPositive ? '#1de9b6' : '#ff5252';
          const date = new Date(item.created_at).toLocaleString('th-TH');
          return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;">
              <div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">${date}</div>
                <div style="font-size: 0.95rem; margin-top: 3px;">${item.reason}</div>
              </div>
              <div style="color: ${color}; font-weight: bold; font-size: 1.1rem; white-space: nowrap; margin-left: 15px;">${sign}${item.amount} ⭐</div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (e) {
    console.error('Failed to load star history', e);
    if (listContainer) listContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted);">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
  }
};

window.closeStarHistoryModal = function() {
  const modal = document.getElementById('star-history-modal');
  if (modal) modal.style.display = 'none';
};

// ==============================================
// MIDNIGHT CHECK
// ==============================================
function setupMidnightCheck() {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0); // เที่ยงคืนของวันนี้
  
  const timeUntilMidnight = nextMidnight.getTime() - now.getTime();
  
  setTimeout(async () => {
    // รีเฟรช streak ให้ผู้ใช้
    try {
      const res = await fetch('/api/daily-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentSession.user.id, role: currentSession.role })
      });
      if (res.ok) {
        const data = await res.json();
        currentSession.user = data.user;
        sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
        
        if (data.user.isNewDay) {
          popupMsg(`🎉 เข้าสู่วันใหม่! คุณได้รับโบนัสล็อกอินรายวัน +${data.user.dailyStarsEarned} ดาว`);
          if (typeof window.openStreakModal === 'function') {
            window.openStreakModal();
          }
        }
      }
    } catch (e) {
      console.error('Midnight check failed:', e);
    }
    
    setupMidnightCheck(); // วนลูปสำหรับวันถัดไป
  }, timeUntilMidnight);
}

window.saveFavorites = async function() {
  const input = document.getElementById('junior-favorites-input');
  if (!input) return;
  const favorites = input.value.trim();
  
  try {
    const res = await fetch('/api/update-favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentSession.user.id, favorites })
    });
    
    if (res.ok) {
      currentSession.user.favorites = favorites;
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      alert('บันทึกข้อมูลเรียบร้อยแล้ว');
    } else {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  }
};

// ==============================================
// REPORT PROBLEM
// ==============================================
window.openReportModal = function() {
  document.getElementById('report-problem').value = '';
  document.getElementById('report-contact').value = '';
  document.getElementById('report-modal').style.display = 'flex';
};

window.closeReportModal = function() {
  document.getElementById('report-modal').style.display = 'none';
};

window.submitReport = async function(event) {
  event.preventDefault();
  const problemText = document.getElementById('report-problem').value.trim();
  const contactInfo = document.getElementById('report-contact').value.trim();
  const email = document.getElementById('report-email').value.trim();
  
  if (!problemText || !email) return;
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerText = 'กำลังส่ง...';
  
  try {
    const res = await fetch('/api/submit-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentSession.user.id,
        userName: currentSession.user.name,
        role: currentSession.role,
        problemText,
        contactInfo,
        email
      })
    });
    
    if (res.ok) {
      alert('ส่งรายงานปัญหาเรียบร้อยแล้ว แอดมินจะติดต่อกลับโดยเร็วที่สุดครับ');
      closeReportModal();
    } else {
      alert('เกิดข้อผิดพลาดในการส่งรายงาน');
    }
  } catch (err) {
    alert('เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = 'ส่งรายงาน';
  }
};

window.loadReports = async function() {
  const container = document.getElementById('admin-reports-list');
  if (!container) return;
  
  container.innerHTML = '<p style="text-align:center;">กำลังโหลด...</p>';
  
  try {
    const res = await fetch('/api/get-reports');
    if (res.ok) {
      const data = await res.json();
      if (!data.reports || data.reports.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: #888;">ไม่มีรายการแจ้งปัญหา</p>';
        return;
      }
      
      container.innerHTML = data.reports.map(r => `
        <div style="background: rgba(255,255,255,0.05); border: 1px solid ${r.status === 'resolved' ? '#4ade80' : '#ff6b6b'}; padding: 10px; border-radius: 8px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <strong style="color:var(--accent-gold);">${r.user_name} (${r.role === 'senior' ? 'พี่รหัส' : (r.role === 'junior' ? 'น้องรหัส' : r.role)})</strong>
            <span style="font-size:0.8rem; color:#888;">${new Date(r.created_at).toLocaleString('th-TH')}</span>
          </div>
          <div style="font-size:0.9rem; margin-bottom:5px;"><strong>ปัญหา:</strong> ${escapeHTML(r.problem_text)}</div>
          <div style="font-size:0.9rem; margin-bottom:10px;"><strong>ติดต่อ:</strong> ${escapeHTML(r.contact_info)}</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.8rem; color:${r.status === 'resolved' ? '#4ade80' : '#ff6b6b'};">
              สถานะ: ${r.status === 'resolved' ? '✅ แก้ไขแล้ว' : '⏳ รอดำเนินการ'}
            </span>
            ${r.status !== 'resolved' ? `
              <button onclick="resolveReport(${r.id})" class="dev-btn" style="background:#4ade80; color:#000; border:none; padding:3px 10px; font-size:0.8rem;">
                ✔ ทำเครื่องหมายว่าแก้แล้ว
              </button>
            ` : ''}
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p style="text-align:center; color: #ff6b6b;">โหลดข้อมูลล้มเหลว</p>';
    }
  } catch (err) {
    container.innerHTML = '<p style="text-align:center; color: #ff6b6b;">เชื่อมต่อล้มเหลว</p>';
  }
};

window.resolveReport = async function(id) {
  if (!confirm('ยืนยันว่าแก้ไขปัญหานี้เรียบร้อยแล้ว?')) return;
  
  try {
    const res = await fetch('/api/resolve-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, adminId: currentSession.user.id })
    });
    
    if (res.ok) {
      loadReports();
    } else {
      alert('เกิดข้อผิดพลาด');
    }
  } catch (err) {
    alert('เชื่อมต่อล้มเหลว');
  }
};

