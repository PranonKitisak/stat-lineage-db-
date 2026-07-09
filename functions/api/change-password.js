// functions/api/change-password.js

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    const { userId, currentPassword, newPassword, avatar } = await request.json();
    
    if (!userId || !currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: "ข้อมูลรหัสผ่านไม่ครบถ้วน" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // ตรวจสอบรหัสผ่านเดิม
    const user = await env.DB.prepare("SELECT password FROM users WHERE id = ?").bind(userId).first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: "ไม่พบผู้ใช้ในระบบ" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    if (user.password !== currentPassword) {
      return new Response(JSON.stringify({ error: "รหัสผ่านเดิมไม่ถูกต้อง" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    // อัปเดตรหัสผ่านใหม่และ avatar (ถ้ามี)
    if (avatar) {
      await env.DB.prepare("UPDATE users SET password = ?, has_changed_password = 1, avatar = ? WHERE id = ?")
        .bind(newPassword, avatar, userId)
        .run();
    } else {
      await env.DB.prepare("UPDATE users SET password = ?, has_changed_password = 1 WHERE id = ?")
        .bind(newPassword, userId)
        .run();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
