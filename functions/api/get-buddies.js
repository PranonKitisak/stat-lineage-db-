// functions/api/get-buddies.js
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const role = url.searchParams.get("role");

  if (!env.DB) return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });
  if (!userId || !role) return new Response(JSON.stringify({ error: "Missing userId or role" }), { status: 400 });

  try {
    let buddies = [];

    if (role === 'senior') {
      const results = await env.DB.prepare(`
        SELECT bp.id as pair_id, u.id, u.email, u.name, u.major, u.ig, u.avatar, u.photo_url as photoUrl, u.favorites, u.stars, u.login_streak 
        FROM buddy_pairs bp 
        JOIN users u ON bp.junior_id = u.id 
        WHERE bp.senior_id = ?
      `).bind(userId).all();
      buddies = results.results;
    } else if (role === 'junior') {
      const results = await env.DB.prepare(`
        SELECT bp.id as pair_id, u.id, u.email, u.name, u.major, u.ig, u.avatar, u.photo_url as photoUrl, u.favorites, u.stars, u.login_streak 
        FROM buddy_pairs bp 
        JOIN users u ON bp.senior_id = u.id 
        WHERE bp.junior_id = ?
      `).bind(userId).all();
      buddies = results.results;
    } else {
      return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400 });
    }

    return new Response(JSON.stringify({ buddies: buddies }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
