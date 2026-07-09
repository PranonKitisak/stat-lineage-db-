// functions/api/buddy-messages.js
// API สำหรับดึงข้อความแชทส่วนตัวของบัดดี้

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const roomId = url.searchParams.get("roomId");

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "ฐานข้อมูล D1 ไม่ได้เชื่อมต่อ" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (request.method === "GET") {
    try {
      if (!roomId) {
        return new Response(JSON.stringify({ error: "ไม่พบ roomId" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // roomId จะเป็นรูปแบบ "buddy_{pairId}" ตามที่เราเซฟลงในตาราง buddy_messages ผ่าน chat-worker
      const chatResults = await env.DB.prepare(
        "SELECT * FROM buddy_messages WHERE room_id = ? ORDER BY id ASC"
      )
      .bind(roomId)
      .all();

      const messages = chatResults.results.map(m => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: m.sender_name,
        senderRole: m.sender_role,
        text: m.text,
        timestamp: m.timestamp
      }));

      return new Response(JSON.stringify(messages), {
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

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
}
