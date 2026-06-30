// functions/api/login.js
// API สำหรับการตรวจสอบการเข้าสู่ระบบ

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
    const { role, email, studentId } = await request.json();
    const cleanEmail = email.trim().toLowerCase();
    const cleanId = studentId.trim();

    // 1. ตรวจสอบนิสิตตามบทบาท อีเมล และรหัสนิสิต
    const { results } = await env.DB.prepare(
      "SELECT * FROM users WHERE role = ? AND LOWER(email) = ? AND id = ?"
    )
    .bind(role, cleanEmail, cleanId)
    .all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: "ไม่พบข้อมูลผู้ใช้ในระบบ" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = results[0];
    
    // 2. ดึงข้อมูลสายรหัสของผู้ใช้
    const lineageResult = await env.DB.prepare(
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
        avatar: seniorResult.avatar
      } : null,
      juniors: juniorsResults.results.map(j => ({
        id: j.id,
        email: j.email,
        name: j.name,
        major: j.major,
        avatar: j.avatar
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
      role: role,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        major: user.major,
        avatar: user.avatar
      },
      lineage: lineageInfo
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
