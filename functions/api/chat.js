// functions/api/chat.js
// API สำหรับการส่งข้อความแชทในสายรหัส

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "ฐานข้อมูล D1 ไม่ได้เชื่อมต่อ" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { lineageId, senderId, senderName, senderRole, text } = await request.json();
    const timestamp = new Date().toISOString();

    await env.DB.prepare(
      "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(lineageId, senderId, senderName, senderRole, text, timestamp)
    .run();

    return new Response(JSON.stringify({
      success: true,
      message: {
        senderId,
        senderName,
        senderRole,
        text,
        timestamp
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
