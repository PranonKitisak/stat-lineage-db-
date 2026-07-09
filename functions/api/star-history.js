// functions/api/star-history.js
export async function onRequestGet(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const { results } = await env.DB.prepare(
      "SELECT * FROM star_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50"
    ).bind(userId).all();

    return new Response(JSON.stringify({ history: results }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
