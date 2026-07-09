// functions/api/admin-update-user.js
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });

  try {
    const { adminId, userId, name, major, ig, avatar, stars, favorites } = await request.json();
    
    const adminUser = await env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(adminId).first();
    if (!adminUser || adminUser.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const targetUser = await env.DB.prepare("SELECT stars FROM users WHERE id = ?").bind(userId).first();
    const oldStars = targetUser ? (targetUser.stars || 0) : 0;

    let query = "UPDATE users SET name = ?, major = ?, ig = ?, avatar = ?, stars = ?";
    let params = [name, major, ig, avatar, stars !== undefined ? stars : 0];
    
    if (favorites !== undefined) {
      query += ", favorites = ?";
      params.push(favorites);
    }
    
    query += " WHERE id = ?";
    params.push(userId);

    await env.DB.prepare(query)
      .bind(...params)
      .run();

    const newStars = stars !== undefined ? stars : 0;
    const starDiff = newStars - oldStars;
    if (starDiff !== 0) {
      const historyId = crypto.randomUUID();
      await env.DB.prepare("INSERT INTO star_history (id, user_id, amount, reason) VALUES (?, ?, ?, ?)")
        .bind(historyId, userId, starDiff, "แอดมินปรับปรุงจำนวนดาว").run();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
