// functions/api/room-messages.js
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const roomId = url.searchParams.get("roomId");

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB missing" }), { status: 500 });
  }

  try {
    const results = await env.DB.prepare(
      "SELECT * FROM messages WHERE lineage_id = ? ORDER BY id ASC"
    )
    .bind(roomId)
    .all();

    const messages = results.results.map(m => ({
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
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
