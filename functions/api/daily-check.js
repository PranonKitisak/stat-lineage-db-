// functions/api/daily-check.js
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

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    const { userId, role } = await request.json();
    
    if (!userId || !role) {
      return new Response(JSON.stringify({ error: "Missing userId or role" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    let user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    let dailyStarsEarned = 0;
    let isNewDay = false;
    let updated = false;

    if (user.role !== 'admin') {
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

      if (user.last_login_date !== today) {
        isNewDay = true;

        if (isYesterday(user.last_login_date)) {
          user.login_streak = (user.login_streak || 0) + 1;
        } else {
          user.login_streak = 1;
        }

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

    return new Response(JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        major: user.major,
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
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
