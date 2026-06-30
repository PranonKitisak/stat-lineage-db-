// app.js - Logic การทำงานของเว็บแอปพลิเคชันระบบสายรหัส

// ตัวแปรเก็บสถานะการเข้าใช้งานปัจจุบัน
let currentSession = null;
let chatInterval = null;
let lastConfigState = { specialHintsRevealed: null, guessingEnabled: null };

// โครงสร้างอนิเมชั่น Confetti (ใช้ Canvas)
let confettiActive = false;
let confettiParticles = [];
const CONFETTI_COLORS = ['#1de9b6', '#00b4d8', '#ffd166', '#ffb703', '#ff6b6b', '#a29bfe'];

class ConfettiParticle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 8 + 4;
    this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    this.speed = Math.random() * 3 + 2;
    this.angle = Math.random() * 360;
    this.spin = Math.random() * 4 - 2;
  }
  update() {
    this.y += this.speed;
    this.angle += this.spin;
    if (this.y > this.canvas.height) {
      this.y = -20;
      this.x = Math.random() * this.canvas.width;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  confettiParticles = [];
  for (let i = 0; i < 150; i++) {
    confettiParticles.push(new ConfettiParticle(canvas));
  }

  function animate() {
    if (!confettiActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    requestAnimationFrame(animate);
  }
  
  animate();
}

function startConfetti() {
  confettiActive = true;
  initConfetti();
  // หยุดตกหลังจาก 6 วินาที
  setTimeout(() => {
    confettiActive = false;
  }, 6000);
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
      e.target.classList.add('active');
      
      const role = e.target.dataset.role;
      const idLabel = document.getElementById('id-label');
      if (role === 'senior') {
        idLabel.textContent = 'รหัสนิสิตพี่รหัส (10 หลัก)';
      } else {
        idLabel.textContent = 'รหัสนิสิตน้องรหัส (10 หลัก)';
      }
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
      if (!devDrawer.contains(e.target) && !devToggle.contains(e.target)) {
        devDrawer.classList.remove('open');
      }
    }
  });
}

// ฟังก์ชันทำเรื่องล็อกอิน
async function handleLogin(e) {
  e.preventDefault();
  
  const role = document.querySelector('.role-btn.active').dataset.role;
  const email = document.getElementById('login-email').value;
  const studentId = document.getElementById('login-id').value;
  const errorMsg = document.getElementById('error-msg');

  const submitBtn = document.querySelector('.login-submit-btn') || document.getElementById('login-submit-btn');
  const originalBtnText = submitBtn ? submitBtn.textContent : "เข้าสู่ระบบ";
  if (submitBtn) {
    submitBtn.textContent = "กำลังเข้าระบบ...";
    submitBtn.disabled = true;
  }

  try {
    const result = await checkLogin(role, email, studentId);

    if (result) {
      errorMsg.style.display = 'none';
      currentSession = result;
      sessionStorage.setItem('stat_session', JSON.stringify(result));
      
      // เคลียร์ค่าฟอร์ม
      document.getElementById('login-email').value = '';
      document.getElementById('login-id').value = '';
      
      renderDashboard();
    } else {
      errorMsg.style.display = 'block';
      errorMsg.textContent = 'ไม่พบข้อมูลนิสิตหรืออีเมลนี้ในระบบบทบาทดังกล่าว กรุณาตรวจสอบอีกครั้ง';
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
      
      const lineages = getLineages();
      const updatedLin = lineages.find(l => l.id === parsed.lineage.id);
      if (updatedLin) {
        currentSession = {
          role: parsed.role,
          user: parsed.role === 'senior' ? updatedLin.senior : updatedLin.juniors.find(j => j.id === parsed.user.id),
          lineage: updatedLin
        };
        sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      } else {
        currentSession = parsed;
      }
      renderDashboard();
    } catch (e) {
      console.error("Error restoring session", e);
      sessionStorage.removeItem('stat_session');
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
  showAuth();
}

// ฟังก์ชันเรนเดอร์หน้า Dashboard ทั้งหมด
function renderDashboard() {
  document.getElementById('auth-section').style.display = 'none';
  const dashboard = document.getElementById('dashboard-section');
  dashboard.style.display = 'block';

  // ล้างเนื้อหาเก่าในแดชบอร์ด
  dashboard.innerHTML = '';

  const role = currentSession.role;
  const user = currentSession.user;
  const lineage = currentSession.lineage;

  if (role === 'junior') {
    renderJuniorDashboard(user, lineage);
  } else if (role === 'senior') {
    renderSeniorDashboard(user, lineage);
  }

  // เริ่มต้นดึงแชทและเช็คสถานะการอัปเดตแบบ Dynamic (ทุกๆ 2 วินาที)
  if (chatInterval) clearInterval(chatInterval);
  chatInterval = setInterval(syncSessionData, 2000);
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
        const isQuizVisible = document.getElementById('guess-senior-name') !== null;
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

        <button class="logout-btn" onclick="handleLogout()">ออกจากระบบ</button>
      </div>

      <!-- คอลัมน์ขวา: ห้องแชทสายรหัส -->
      <div class="content-panel">
        <div class="panel-title">
          <span>💬 ห้องแชทสายรหัส</span>
        </div>
        <div class="chat-container">
          <div class="chat-header">
            <div class="chat-title-group">
              <h4 id="chat-room-title">แชทคุยกับพี่รหัส</h4>
              <p><span class="online-badge"></span> ระบบส่งข้อความแบบปลอดภัย (ไม่เผยชื่อพี่รหัส)</p>
            </div>
          </div>
          <div class="chat-messages" id="chat-messages-box">
            <!-- ข้อความแชท -->
          </div>
          <div class="chat-input-area">
            <input type="text" id="chat-input-field" class="chat-input" placeholder="พิมพ์ข้อความคุยตอบโต้..." autocomplete="off">
            <button class="send-msg-btn" id="send-msg-btn">✈️</button>
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
    if (config.specialHintsRevealed) {
      html += `
        <div class="hint-item special-hint" style="margin-top: 15px;">
          <div class="hint-number">⭐ คำใบ้พิเศษ (เปิดเผยแล้ว)</div>
          <div class="hint-text" style="font-weight: 500;">${escapeHtml(specialHint)}</div>
        </div>
      `;
    } else {
      html += `
        <div class="hint-item special-hint locked" style="margin-top: 15px;">
          <div class="hint-number">🔒 คำใบ้พิเศษ</div>
          <div class="hint-text" style="color: var(--text-muted); font-style: italic;">จะเปิดเผยพร้อมกันในวันงานกิจกรรมสายรหัส</div>
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

        <!-- แผงจัดการคำใบ้พิเศษสำหรับวันงาน -->
        <div class="panel-title">
          <span>⭐ คำใบ้พิเศษสำหรับวันงาน</span>
        </div>
        <div class="hints-mgmt-container" style="margin-bottom: 25px;">
          <div class="hint-input-group">
            <input type="text" id="special-hint-input" class="input-control" placeholder="พิมพ์แก้ไขคำใบ้พิเศษ..." value="${lineage.specialHint || ''}" autocomplete="off">
            <button class="add-hint-btn" onclick="updateSpecialHint()" style="background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);">บันทึก</button>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 5px; line-height: 1.3;">คำใบ้นี้จะเปิดเผยพร้อมกันทุกคนเมื่อผู้ดูแลระบบกดเฉลยในวันกิจกรรม (คุณสามารถแก้ไขข้อความนี้ได้ตลอดเวลา)</p>
        </div>

        <button class="logout-btn" onclick="handleLogout()">ออกจากระบบ</button>
      </div>

      <!-- คอลัมน์ขวา: ห้องแชทสายรหัส -->
      <div class="content-panel">
        <div class="panel-title">
          <span>💬 ห้องแชทสายรหัส</span>
        </div>
        <div class="chat-container">
          <div class="chat-header">
            <div class="chat-title-group">
              <h4 id="chat-room-title">แชทคุยกับน้องรหัส</h4>
              <p><span class="online-badge"></span> แชทกลุ่มสายรหัสสมาชิก ${lineage.juniors.length + 1} คน (แสดงชื่อจริงของน้องๆ)</p>
            </div>
          </div>
          <div class="chat-messages" id="chat-messages-box">
            <!-- ข้อความแชท -->
          </div>
          <div class="chat-input-area">
            <input type="text" id="chat-input-field" class="chat-input" placeholder="พิมพ์ข้อความถึงน้องๆ..." autocomplete="off">
            <button class="send-msg-btn" id="send-msg-btn">✈️</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  dashboard.innerHTML = html;
  
  renderSeniorJuniorsList();
  renderSeniorHintsList();
  renderChatMessages();
  
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
        <p>สาขา: ${jun.major}</p>
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

// ---------------------------------
// CHAT FUNCTIONALITY
// ---------------------------------
function renderChatMessages() {
  const box = document.getElementById('chat-messages-box');
  if (!box) return;
  
  const messages = currentSession.lineage.messages || [];
  const currentUser = currentSession.user;
  const isRevealed = currentSession.lineage.revealed;
  
  if (messages.length === 0) {
    box.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-top: 40px;">
        💬 เริ่มแชทคุยถามไถ่สายรหัสกันที่นี่ได้เลย!
      </div>
    `;
    return;
  }
  
  let html = '';
  messages.forEach(msg => {
    // เช็คว่าเป็นข้อความที่ส่งจากบัญชีที่กำลังล็อกอินอยู่หรือไม่
    const isOutgoing = msg.senderId === currentUser.id;
    
    // คัดกรองการแสดงผลชื่อผู้ส่ง:
    // 1. ถ้าคนดูแชทคือ น้องรหัส (junior):
    //    - ข้อความฝั่งพี่รหัส (senior) ส่งมา: ถ้าเผยตัวแล้ว (revealed) แสดงชื่อพี่รหัส ถ้ายังไม่เผย แสดงคำว่า "พี่รหัส (Anonymous)"
    //    - ข้อความฝั่งน้องรหัส (junior) ส่งมา: แสดงชื่อน้องรหัสนั้นจริงๆ (กรณีน้องคู่แชทคุยกัน)
    // 2. ถ้าคนดูแชทคือ พี่รหัส (senior):
    //    - ข้อความพี่รหัสแสดงชื่อตนเอง
    //    - ข้อความน้องรหัสแสดงชื่อจริงของน้องรหัส
    let displaySenderName = '';
    
    if (currentSession.role === 'junior') {
      if (msg.senderRole === 'senior') {
        displaySenderName = isRevealed ? msg.senderName : '🤐 พี่รหัสผู้ลึกลับ';
      } else {
        displaySenderName = msg.senderId === currentUser.id ? 'ฉัน' : msg.senderName;
      }
    } else {
      if (msg.senderRole === 'senior') {
        displaySenderName = 'ฉัน';
      } else {
        displaySenderName = msg.senderName;
      }
    }
    
    const timeStr = new Date(msg.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    
    html += `
      <div class="msg-bubble ${isOutgoing ? 'outgoing' : 'incoming'}">
        <div class="msg-sender">${displaySenderName}</div>
        <div class="msg-content">${escapeHtml(msg.text)}</div>
        <div class="msg-time">${timeStr}</div>
      </div>
    `;
  });
  
  box.innerHTML = html;
  // เลื่อนหน้าจอไปที่ข้อความล่าสุด
  box.scrollTop = box.scrollHeight;
}

function setupChatSubmit() {
  const btn = document.getElementById('send-msg-btn');
  const input = document.getElementById('chat-input-field');
  
  if (!btn || !input) return;
  
  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;
    
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
      
      // ส่งข้อความไป Cloudflare Server
      apiSendMessage(currentSession.lineage.id, newMsg.senderId, newMsg.senderName, newMsg.senderRole, newMsg.text);
      
      // อัปเดตข้อมูล Session ปัจจุบัน
      currentSession.lineage = lineages[index];
      sessionStorage.setItem('stat_session', JSON.stringify(currentSession));
      
      input.value = '';
      renderChatMessages();
    }
  };
  
  btn.onclick = sendMessage;
  input.onkeypress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
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
  let linksHtml = '';
  lineages.forEach(lin => {
    // พี่รหัส
    linksHtml += `
      <button class="dev-btn" onclick="devLogin('senior', '${lin.senior.email}', '${lin.senior.id}')">
        <span>🔑 ล็อกอินพี่รหัส: ${lin.senior.name.split(' ')[0]}</span>
        <span class="badge">พี่รหัส</span>
      </button>
    `;
    // น้องรหัส (มีกี่คนเรนเดอร์ให้ครบ)
    lin.juniors.forEach(jun => {
      linksHtml += `
        <button class="dev-btn" onclick="devLogin('junior', '${jun.email}', '${jun.id}')">
          <span>🔑 ล็อกอินน้องรหัส: ${jun.name.split(' ')[0]}</span>
          <span class="badge">น้องรหัส</span>
        </button>
      `;
    });
  });
  
  container.innerHTML = linksHtml;

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
    const result = await checkLogin(role, email, id);
    if (result) {
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

  container.innerHTML = `
    <div class="guessing-panel">
      <div class="guessing-title">🗳️ ทายชื่อพี่รหัส & สาขาวิชา</div>
      <div class="guess-form">
        <select id="guess-senior-name" class="guess-select">
          <option value="" disabled selected>-- เลือกทายชื่อพี่รหัส --</option>
          ${seniorNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}
        </select>
        <select id="guess-senior-major" class="guess-select">
          <option value="" disabled selected>-- เลือกทายสาขาวิชา --</option>
          ${majors.map(maj => `<option value="${escapeHtml(maj)}">${escapeHtml(maj)}</option>`).join('')}
        </select>
        <button onclick="submitGuess()" class="guess-submit-btn">ส่งคำตอบ</button>
      </div>
    </div>
  `;
}

// ฟังก์ชันส่งคำตอบทายพี่รหัสฝั่งน้อง
function submitGuess() {
  const nameSelect = document.getElementById('guess-senior-name');
  const majorSelect = document.getElementById('guess-senior-major');
  
  if (!nameSelect || !majorSelect) return;
  
  const guessedName = nameSelect.value;
  const guessedMajor = majorSelect.value;
  
  if (!guessedName || !guessedMajor) {
    alert("กรุณาเลือกทายทั้งชื่อพี่รหัสและสาขาวิชาให้ครบถ้วน!");
    return;
  }
  
  const actualSenior = currentSession.lineage.senior;
  
  if (guessedName === actualSenior.name && guessedMajor === actualSenior.major) {
    // ทายถูก!
    // 1. อัปเดตฐานข้อมูล
    const lineages = getLineages();
    const idx = lineages.findIndex(l => l.id === currentSession.lineage.id);
    if (idx !== -1) {
      lineages[idx].revealed = true;
      saveLineages(lineages);
      
      // อัปเดตบน Cloudflare Server
      apiToggleReveal(currentSession.lineage.id, true);
      
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
}

// ฟังก์ชันบันทึกแก้ไขคำใบ้พิเศษฝั่งพี่รหัส
function updateSpecialHint() {
  const input = document.getElementById('special-hint-input');
  if (!input) return;

  const value = input.value.trim();
  if (!value) {
    alert("กรุณากรอกข้อความคำใบ้พิเศษ ไม่สามารถปล่อยให้ว่างได้!");
    return;
  }

  const lineages = getLineages();
  const index = lineages.findIndex(l => l.id === currentSession.lineage.id);

  if (index !== -1) {
    lineages[index].specialHint = value;
    saveLineages(lineages);

    // เซฟลง Cloudflare
    apiUpdateSpecialHint(currentSession.lineage.id, value);

    // อัปเดตข้อมูล Session ปัจจุบัน
    currentSession.lineage = lineages[index];
    sessionStorage.setItem('stat_session', JSON.stringify(currentSession));

    alert("บันทึกคำใบ้พิเศษสำเร็จแล้ว! 🎉");
  }
}
