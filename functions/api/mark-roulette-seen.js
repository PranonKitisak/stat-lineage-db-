// functions/api/mark-roulette-seen.js
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });

  try {
    const { userId } = await request.json();
    if (!userId) return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });

    await env.DB.prepare("UPDATE users SET has_seen_roulette = 1 WHERE id = ?").bind(userId).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
