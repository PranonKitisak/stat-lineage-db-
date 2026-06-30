// database.js - จำลองฐานข้อมูลระบบสายรหัส
// ข้อมูลเริ่มต้นสำหรับระบบเมื่อรันครั้งแรก

const INITIAL_LINEAGES = [
  {
    id: "lineage-01",
    revealed: false,
    specialHint: "พี่เคยแต่งคอสเพลย์เป็นจิ้งจอกเก้าหางมาทำข้อสอบกลางภาคในคณะ!",
    hints: [
      "พี่ตัวสูงกว่าหนูอยู่นะ มีสีส้มๆ แดงๆ ในตัว (หรือเปล่า?)",
      "พี่ชอบดื่มน้ำบลูเบอร์รี่แยกกากเป็นชีวิตจิตใจ",
      "พี่มักจะชอบหยอกล้อคนอื่นด้วยท่วงท่าที่ดูเจ้าเล่ห์แต่จริงใจนะ!"
    ],
    senior: {
      id: "6732001026",
      email: "nick.wilde@gmail.com",
      name: "พี่นิค (Nick Wilde)",
      major: "สถิติสารสนเทศและการวิเคราะห์ข้อมูล (STAT)",
      avatar: "🦊"
    },
    juniors: [
      {
        id: "6832005042",
        email: "judy.hopps@outlook.com",
        name: "น้องจูดี้ (Judy Hopps)",
        major: "สถิติสารสนเทศและการวิเคราะห์ข้อมูล (STAT)",
        avatar: "🐰"
      }
    ],
    messages: [
      {
        senderId: "6732001026",
        senderName: "พี่นิค (Nick Wilde)",
        senderRole: "senior",
        text: "ยินดีต้อนรับสู่อ้อมกอดของสายรหัสสุดเจ๋งนะจ๊ะกระต่ายน้อย!",
        timestamp: "2026-06-29T10:00:00.000Z"
      },
      {
        senderId: "6832005042",
        senderName: "น้องจูดี้ (Judy Hopps)",
        senderRole: "junior",
        text: "ขอบคุณค่ะพี่รหัส! หนูจะตามหาตัวพี่ให้เจอให้ได้เลยคอยดูสิ!",
        timestamp: "2026-06-29T10:05:00.000Z"
      },
      {
        senderId: "6732001026",
        senderName: "พี่นิค (Nick Wilde)",
        senderRole: "senior",
        text: "หึๆ พยายามเข้าล่ะ แม่สาวน้อยผู้พิทักษ์สันติราษฎร์",
        timestamp: "2026-06-29T10:10:00.000Z"
      }
    ]
  },
  {
    id: "lineage-02",
    revealed: false,
    specialHint: "คำใบ้พิเศษคือ... พี่เคยเผลอทำแก้วชานมไข่มุกร่วงใส่เป๋าเป้เพื่อนรหัสตอนอยู่ปี 1 จ้า 5555",
    hints: [
      "คำ... ใบ้... นี้... พิมพ์... ช้า... มาก... นะ... น้อง... รหัส...",
      "พี่ชอบสีเขียวเหนี่ยวทรัพย์ และชอบห้อยบัตรประจำตัวกลับด้าน",
      "พี่รักความเร็ว (ตอนขับรถ) แต่เวลาทำงาน... ขอตัวนอนแพล๊บบบ"
    ],
    senior: {
      id: "6732002015",
      email: "flash.sloth@gmail.com",
      name: "พี่แฟลช (Flash Slothmore)",
      major: "วิทยาการจัดการข้อมูล (Data Science)",
      avatar: "🦥"
    },
    juniors: [
      {
        id: "6832006011",
        email: "priscilla.sloth@gmail.com",
        name: "น้องพริสซิลลา (Priscilla Sloth)",
        major: "วิทยาการจัดการข้อมูล (Data Science)",
        avatar: "🦦"
      },
      {
        id: "6832006022",
        email: "little.sheep@outlook.com",
        name: "น้องแกะน้อย (Little Sheep)",
        major: "การประกันภัย (Insurance)",
        avatar: "🐑"
      }
    ],
    messages: [
      {
        senderId: "6732002015",
        senderName: "พี่แฟลช (Flash Slothmore)",
        senderRole: "senior",
        text: "ส... วั... ส... ด... ดี... จ้... า...",
        timestamp: "2026-06-29T11:00:00.000Z"
      },
      {
        senderId: "6832006011",
        senderName: "น้องพริสซิลลา (Priscilla Sloth)",
        senderRole: "junior",
        text: "ส... วั... ส... ดี... ค่... ะ... พี่... ร... หั... ส...",
        timestamp: "2026-06-29T11:02:00.000Z"
      },
      {
        senderId: "6832006022",
        senderName: "น้องแกะน้อย (Little Sheep)",
        senderRole: "junior",
        text: "หนูอ่านแชทแล้วเหนื่อยเลยค่ะ 5555555 สวัสดีค่ะพี่รหัส!",
        timestamp: "2026-06-29T11:05:00.000Z"
      },
      {
        senderId: "6732002015",
        senderName: "พี่แฟลช (Flash Slothmore)",
        senderRole: "senior",
        text: "มี... น้... อ... ง... ส... อ... ง... ค... น... ดี... ใ... จ... จั... ง...",
        timestamp: "2026-06-29T11:15:00.000Z"
      }
    ]
  },
  {
    id: "lineage-03",
    revealed: false,
    specialHint: "พี่มีโมเดลฟิกเกอร์สารวัตรควายป่าสูงสองฟุตตั้งโชว์อยู่ในห้องนอน!",
    hints: [
      "พี่ตัวใหญ่และดูน่ากลัว แต่จริงๆ พี่เป็นคนใจดีและรักดนตรีคลาสสิกนะ",
      "พี่มักจะถือกาแฟแก้วใหญ่มากในคณะ",
      "พี่ไม่ชอบให้ใครมาล้อเรื่องเขาบนหัว!"
    ],
    senior: {
      id: "6732003055",
      email: "chief.bogo@gmail.com",
      name: "พี่สารวัตรโบโก (Chief Bogo)",
      major: "การประกันภัย (Insurance)",
      avatar: "🐃"
    },
    juniors: [
      {
        id: "6832007077",
        email: "clawhauser.donut@gmail.com",
        name: "น้องคลอฮาวเซอร์ (Clawhauser)",
        major: "สถิติประยุกต์ (Applied Stat)",
        avatar: "🐆"
      }
    ],
    messages: [
      {
        senderId: "6732003055",
        senderName: "พี่สารวัตรโบโก (Chief Bogo)",
        senderRole: "senior",
        text: "ยินดีด้วยที่ได้มาอยู่สายนี้ อย่าสร้างปัญหาล่ะ ตั้งใจเรียนด้วย",
        timestamp: "2026-06-29T12:00:00.000Z"
      },
      {
        senderId: "6832007077",
        senderName: "น้องคลอฮาวเซอร์ (Clawhauser)",
        senderRole: "junior",
        text: "รับทราบค่ะผู้การ! เอ้ย พี่รหัส! มีโดนัทต้อนรับน้องไหมคะเนี่ยยย 🍩",
        timestamp: "2026-06-29T12:05:00.000Z"
      }
    ]
  }
];

// ฟังก์ชันสำหรับดึงข้อมูลสายรหัสทั้งหมดจาก localStorage หรือโหลดข้อมูลเริ่มต้น
function getLineages() {
  const localData = localStorage.getItem("stat_lineage_data");
  if (!localData) {
    localStorage.setItem("stat_lineage_data", JSON.stringify(INITIAL_LINEAGES));
    return INITIAL_LINEAGES;
  }
  try {
    const data = JSON.parse(localData);
    
    // ตรวจสอบและอัปเกรดข้อมูล (Migration) หากขาดฟิลด์คำใบ้พิเศษ หรือต้องการอัปเดตอีเมลสำหรับการทดสอบ
    let updated = false;
    data.forEach((lin) => {
      const initial = INITIAL_LINEAGES.find(i => i.id === lin.id);
      if (initial) {
        // อัปเกรดฟิลด์ specialHint หากยังไม่มีใน localStorage
        if (!lin.hasOwnProperty('specialHint')) {
          lin.specialHint = initial.specialHint;
          updated = true;
        }
        // อัปเดตอีเมลพี่รหัสเผื่อกรณีใช้ข้อมูลเก่าอยู่
        if (lin.senior.email !== initial.senior.email) {
          lin.senior.email = initial.senior.email;
          updated = true;
        }
        // อัปเดตอีเมลน้องรหัส
        lin.juniors.forEach((jun, jIdx) => {
          const initJun = initial.juniors[jIdx];
          if (initJun && jun.email !== initJun.email) {
            jun.email = initJun.email;
            updated = true;
          }
        });
      }
    });
    
    if (updated) {
      localStorage.setItem("stat_lineage_data", JSON.stringify(data));
    }
    
    return data;
  } catch (e) {
    console.error("Error parsing lineage data, resetting to initial", e);
    localStorage.setItem("stat_lineage_data", JSON.stringify(INITIAL_LINEAGES));
    return INITIAL_LINEAGES;
  }
}

// ฟังก์ชันสำหรับบันทึกข้อมูลสายรหัสทั้งหมดลง localStorage
function saveLineages(lineages) {
  localStorage.setItem("stat_lineage_data", JSON.stringify(lineages));
}

// ฟังก์ชันดึงคอนฟิกของระบบทายและคำใบ้พิเศษ
function getGlobalConfig() {
  const config = localStorage.getItem("stat_lineage_config");
  if (!config) {
    const initialConfig = {
      specialHintsRevealed: false,
      guessingEnabled: false
    };
    localStorage.setItem("stat_lineage_config", JSON.stringify(initialConfig));
    return initialConfig;
  }
  try {
    return JSON.parse(config);
  } catch (e) {
    const initialConfig = {
      specialHintsRevealed: false,
      guessingEnabled: false
    };
    localStorage.setItem("stat_lineage_config", JSON.stringify(initialConfig));
    return initialConfig;
  }
}

// ฟังก์ชันเซฟคอนฟิกของระบบทายและคำใบ้พิเศษ
function saveGlobalConfig(config) {
  localStorage.setItem("stat_lineage_config", JSON.stringify(config));
}

// ==========================================
// CLOUDFLARE SERVER API SYNC LOGIC
// ==========================================

// ฟังก์ชันซิงค์ข้อมูลกับ Server Cloudflare Backend
async function syncWithServer() {
  try {
    // 1. ซิงค์ค่าสายรหัสทั้งหมด
    const resLineages = await fetch("/api/lineages");
    if (resLineages.ok) {
      const lineages = await resLineages.json();
      localStorage.setItem("stat_lineage_data", JSON.stringify(lineages));
    }
    
    // 2. ซิงค์ค่าคอนฟิกระบบวันงาน
    const resConfig = await fetch("/api/config");
    if (resConfig.ok) {
      const config = await resConfig.json();
      localStorage.setItem("stat_lineage_config", JSON.stringify(config));
    }
  } catch (err) {
    console.warn("Unable to sync with Cloudflare Server (running offline mode?):", err);
  }
}

// ฟังก์ชันตรวจสอบสิทธิ์การ Login
// คืนค่า { role: 'junior'|'senior', user: UserObject, lineage: LineageObject }
async function checkLogin(role, email, studentId) {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, email, studentId })
    });
    
    if (res.ok) {
      const data = await res.json();
      // อัปเดตข้อมูล cache ในเบราว์เซอร์ทันที
      await syncWithServer();
      return data;
    }
  } catch (err) {
    console.error("Login API request failed, falling back to local database:", err);
  }
  
  // fallback ในกรณีออฟไลน์หรือยังไม่ดีพลอย
  const lineages = getLineages();
  const cleanEmail = email.trim().toLowerCase();
  const cleanId = studentId.trim();

  for (const lin of lineages) {
    if (role === "senior") {
      if (lin.senior.id === cleanId && lin.senior.email.toLowerCase() === cleanEmail) {
        return {
          role: "senior",
          user: lin.senior,
          lineage: lin
        };
      }
    } else if (role === "junior") {
      const junior = lin.juniors.find(
        j => j.id === cleanId && j.email.toLowerCase() === cleanEmail
      );
      if (junior) {
        return {
          role: "junior",
          user: junior,
          lineage: lin
        };
      }
    }
  }
  return null;
}

// ฟังก์ชันล้างข้อมูลกลับไปเป็นค่าเริ่มต้นและรีเซ็ต D1 บน Cloudflare
async function resetDatabase() {
  try {
    await fetch("/api/reset", { method: "POST" });
  } catch (err) {
    console.error("API reset failed:", err);
  }
  
  localStorage.setItem("stat_lineage_data", JSON.stringify(INITIAL_LINEAGES));
  localStorage.removeItem("stat_lineage_config");
  sessionStorage.removeItem("stat_session");
  location.reload();
}

// API ยิงส่งข้อความแชทไปเซิร์ฟเวอร์
async function apiSendMessage(lineageId, senderId, senderName, senderRole, text) {
  try {
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineageId, senderId, senderName, senderRole, text })
    });
  } catch (err) {
    console.error("Send message API failed:", err);
  }
}

// API ยิงเพิ่ม/ลบคำใบ้ และแก้ไขคำใบ้พิเศษ
async function apiAddHint(lineageId, hintText) {
  try {
    await fetch("/api/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", lineageId, hintText })
    });
  } catch (err) {
    console.error("Add hint API failed:", err);
  }
}

async function apiDeleteHint(lineageId, index) {
  try {
    await fetch("/api/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", lineageId, index })
    });
  } catch (err) {
    console.error("Delete hint API failed:", err);
  }
}

async function apiUpdateSpecialHint(lineageId, specialHintText) {
  try {
    await fetch("/api/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateSpecialHint", lineageId, specialHintText })
    });
  } catch (err) {
    console.error("Update special hint API failed:", err);
  }
}

// API ยิงเปิดเผย/ปิดบังสายรหัส
async function apiToggleReveal(lineageId, revealed) {
  try {
    await fetch("/api/lineages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineageId, revealed })
    });
  } catch (err) {
    console.error("Toggle reveal API failed:", err);
  }
}

// API เซฟคอนฟิกระบบวันงาน
async function apiSaveConfig(config) {
  try {
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    });
  } catch (err) {
    console.error("Save config API failed:", err);
  }
}
