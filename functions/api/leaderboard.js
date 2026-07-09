// functions/api/leaderboard.js
export async function onRequest(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB missing" }), { status: 500 });
  }

  try {
    const results = await env.DB.prepare(
      "SELECT global_name, stars FROM users WHERE global_name IS NOT NULL ORDER BY stars DESC LIMIT 10"
    ).all();

    return new Response(JSON.stringify(results.results), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
