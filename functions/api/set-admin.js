// functions/api/set-admin.js

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    const { requestingUserId, targetEmail } = await request.json();
    
    if (!requestingUserId || !targetEmail) {
      return new Response(JSON.stringify({ error: "ข้อมูลไม่ครบถ้วน" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // ตรวจสอบสิทธิ์ของ requestingUserId ว่าเป็นแอดมินหรือไม่
    const reqUser = await env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(requestingUserId).first();
    
    if (!reqUser || reqUser.role !== 'admin') {
      return new Response(JSON.stringify({ error: "คุณไม่มีสิทธิ์ผู้ดูแลระบบหลัก (Super Admin)" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    const cleanEmail = targetEmail.trim().toLowerCase();

    // เช็คว่ามีเป้าหมายไหม
    const targetUser = await env.DB.prepare("SELECT id FROM users WHERE LOWER(email) = ?").bind(cleanEmail).first();
    if (!targetUser) {
      return new Response(JSON.stringify({ error: "ไม่พบผู้ใช้ที่ใช้อีเมลนี้" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    // เลื่อนขั้นเป็น Admin
    await env.DB.prepare("UPDATE users SET role = 'admin' WHERE LOWER(email) = ?")
      .bind(cleanEmail)
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
