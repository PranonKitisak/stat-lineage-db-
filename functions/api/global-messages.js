// functions/api/global-messages.js
export async function onRequest(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB missing" }), { status: 500 });
  }

  try {
    const results = await env.DB.prepare(
      "SELECT * FROM global_messages ORDER BY id DESC LIMIT 50"
    ).all();

    const messages = results.results.reverse().map(m => ({
      id: m.id,
      senderId: m.sender_id,
      senderName: m.sender_name,
      senderRole: m.sender_role,
      text: m.text,
      timestamp: m.timestamp,
      isSystem: m.is_system === 1
    }));

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
