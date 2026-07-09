// functions/api/login.js
// API สำหรับการตรวจสอบการเข้าสู่ระบบ

function getThaiDateString(date) {
  const thaiOffset = 7 * 60 * 60 * 1000;
  const thaiDate = new Date(date.getTime() + thaiOffset);
  return thaiDate.toISOString().split('T')[0];
}

function isYesterday(dateStr) {
  if (!dateStr) return false;
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return dateStr === getThaiDateString(yesterday);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // ตรวจสอบการเชื่อมต่อฐานข้อมูล D1
  if (!env.DB) {
    return new Response(JSON.stringify({ error: "ฐานข้อมูล D1 ไม่ได้เชื่อมต่อ (D1 Binding missing)" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { role, email, password } = await request.json();
    const cleanEmail = email.trim().toLowerCase();

    // 1. ตรวจสอบนิสิตตามบทบาท อีเมล และรหัสผ่าน
    let user = await env.DB.prepare("SELECT * FROM users WHERE LOWER(email) = ? AND password = ?").bind(cleanEmail, password).first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    // Role validation
    if (role && user.role !== 'admin' && role !== user.role) {
      return new Response(JSON.stringify({ error: `คุณไม่ใช่${role === 'junior' ? 'น้องรหัส' : 'พี่รหัส'} กรุณาเลือกบทบาทที่ถูกต้อง` }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    // Daily Login Streak + Global Name Assignment
    let dailyStarsEarned = 0;
    let isNewDay = false;

    if (user.role !== 'admin') {
      let updated = false;
      const today = getThaiDateString(new Date());
      
      // Assign global name if null
      if (!user.global_name) {
        const adjectives = ["พเนจร", "ใจดี", "ขี้เซา", "จอมซน", "นักสืบ", "ผู้ลึกลับ", "ยอดนักปราชญ์", "สายชิล", "ทรงพลัง", "ผู้หิวโหย", "ขี้อาย", "ผู้กล้า", "นักสำรวจ", "จอมเวทย์", "นักปราชญ์", "ผู้น่ารัก", "ขี้เล่น", "ตาหวาน", "นักวิ่ง", "ขี้บ่น", "จอมขี้เกียจ", "ผู้ร่าเริง", "ผู้สันโดษ", "นักกิน", "นักล่า"];
        const animals = ["กระต่ายน้อย", "ควายป่า", "สลอธ", "จิ้งจอก", "เสือชีตาห์", "สิงโต", "นากน้อย", "แพนด้า", "หมีขั้วโลก", "เพนกวิน", "แมวน้ำ", "โลมา", "ฉลาม", "นกฮูก", "แฮมสเตอร์", "คาปิบาร่า", "อัลปาก้า", "จิงโจ้", "โคอาล่า", "เม่นแคระ", "สุนัขจิ้งจอก", "แรคคูน", "นกแก้ว", "เต่าทะเล", "ม้าน้ำ"];
        
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomAni = animals[Math.floor(Math.random() * animals.length)];
        const randomNum = Math.floor(Math.random() * 99) + 1; // 1-99
        
        user.global_name = `${randomAni}${randomAdj} #${randomNum}`;
        updated = true;
      }

      // Streak-based Daily Login
      if (user.last_login_date !== today) {
        isNewDay = true;

        if (isYesterday(user.last_login_date)) {
          // Streak continues
          user.login_streak = (user.login_streak || 0) + 1;
        } else {
          // Streak broken (or first login ever) — reset to 1
          user.login_streak = 1;
        }

        // Base star reward
        dailyStarsEarned = 1;

        // Bonus: Day 45 = +15 stars
        if (user.login_streak === 45) {
          dailyStarsEarned += 15;
        }
        // Bonus: Every 5th day (5, 10, 15, 20, 25, 30, 35, 40) = +5 bonus stars
        else if (user.login_streak % 5 === 0) {
          dailyStarsEarned += 5;
        }

        user.stars = (user.stars || 0) + dailyStarsEarned;
        user.last_login_date = today;
        user.global_message_count = 0;
        user.lineage_message_count = 0;
        updated = true;
      }

      if (updated) {
        await env.DB.prepare("UPDATE users SET global_name = ?, stars = ?, last_login_date = ?, login_streak = ?, global_message_count = ?, lineage_message_count = ? WHERE id = ?")
          .bind(user.global_name, user.stars, user.last_login_date, user.login_streak || 0, user.global_message_count || 0, user.lineage_message_count || 0, user.id).run();

        if (dailyStarsEarned > 0) {
          const historyId = crypto.randomUUID();
          await env.DB.prepare("INSERT INTO star_history (id, user_id, amount, reason) VALUES (?, ?, ?, ?)")
            .bind(historyId, user.id, dailyStarsEarned, "ล็อกอินประจำวัน").run();
        }
      }
    }

    // ถ้าเป็น admin ให้ส่งกลับข้อมูลแอดมินโดยไม่มีข้อมูลสายรหัส (แอดมินสามารถล็อกอินผ่าน role ใดก็ได้)
    if (user.role === 'admin') {
      // ดึง config มาด้วย
      const configResults = await env.DB.prepare("SELECT * FROM config").all();
      const configMap = {};
      configResults.results.forEach(c => { configMap[c.key] = c.value });

      return new Response(JSON.stringify({
        role: 'admin',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'admin',
          hasChangedPassword: user.has_changed_password === 1,
          hasSeenRoulette: true, // admin ไม่ต้องดู roulette
          stars: user.stars || 0,
          loginStreak: user.login_streak || 0
        },
        config: {
          adminAllowSpecialHint: configMap['admin_allow_special_hint'] === 'true',
          guessingEnabled: configMap['guessing_enabled'] === 'true',
          globalChatEnabled: configMap['global_chat_enabled'] !== 'false'
        }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // 2. ดึงข้อมูลสายรหัสของผู้ใช้
    const lineage = await env.DB.prepare(
      "SELECT * FROM lineages WHERE id = ?"
    )
    .bind(user.lineage_id)
    .first();

    // 3. ดึงข้อมูลสมาชิกอื่นๆ ในสายรหัส
    const seniorResult = await env.DB.prepare(
      "SELECT * FROM users WHERE lineage_id = ? AND role = 'senior'"
    )
    .bind(user.lineage_id)
    .first();

    const juniorsResults = await env.DB.prepare(
      "SELECT * FROM users WHERE lineage_id = ? AND role = 'junior' ORDER BY id ASC"
    )
    .bind(user.lineage_id)
    .all();

    // 4. ดึงคำใบ้ปกติ
    const hintsResults = await env.DB.prepare(
      "SELECT hint_text FROM hints WHERE lineage_id = ? ORDER BY id ASC"
    )
    .bind(user.lineage_id)
    .all();
    const hints = hintsResults.results.map(h => h.hint_text);

    // 5. ดึงแชทประวัติ
    const chatResults = await env.DB.prepare(
      "SELECT * FROM messages WHERE lineage_id = ? ORDER BY id ASC"
    )
    .bind(user.lineage_id)
    .all();

    // 6. ดึง Config
    const configResults = await env.DB.prepare("SELECT * FROM config").all();
    const configMap = {};
    configResults.results.forEach(c => { configMap[c.key] = c.value });

    const lineageInfo = {
      id: lineage.id,
      revealed: lineage.revealed === 1,
      specialHintRevealed: lineage.special_hint_revealed === 1,
      specialHint: lineage.special_hint,
      hints: hints,
      senior: seniorResult ? {
        id: seniorResult.id,
        email: seniorResult.email,
        name: (user.role === 'junior' && lineage.revealed === 0) ? undefined : seniorResult.name,
        major: (user.role === 'junior' && lineage.revealed === 0) ? undefined : seniorResult.major,
        avatar: seniorResult.avatar
      } : null,
      juniors: juniorsResults.results.map(j => ({
        id: j.id,
        email: j.email,
        name: j.name,
        major: j.major,
        ig: j.ig,
        avatar: j.avatar,
        photoUrl: j.photo_url || "",
        favorites: j.favorites || ""
      })),
      messages: chatResults.results.map(m => ({
        senderId: m.sender_id,
        senderName: m.sender_name,
        senderRole: m.sender_role,
        text: m.text,
        timestamp: m.timestamp
      }))
    };

    return new Response(JSON.stringify({
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        major: user.major,
        ig: user.ig || '',
        avatar: user.avatar,
        photoUrl: user.photo_url || "",
        favorites: user.favorites || "",
        hasChangedPassword: user.has_changed_password === 1,
        hasSeenRoulette: user.has_seen_roulette === 1,
        stars: user.stars || 0,
        globalName: user.global_name || "",
        loginStreak: user.login_streak || 0,
        globalMessageCount: user.global_message_count || 0,
        lineageMessageCount: user.lineage_message_count || 0,
        dailyStarsEarned: dailyStarsEarned,
        isNewDay: isNewDay
      },
      lineage: lineageInfo,
      config: {
        adminAllowSpecialHint: configMap['admin_allow_special_hint'] === 'true',
        guessingEnabled: configMap['guessing_enabled'] === 'true',
        globalChatEnabled: configMap['global_chat_enabled'] !== 'false'
      }
    }), {
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
