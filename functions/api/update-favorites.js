// functions/api/update-favorites.js
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });

  try {
    const { userId, favorites } = await request.json();
    
    if (!userId || favorites === undefined) {
      return new Response(JSON.stringify({ error: "Missing userId or favorites" }), { status: 400 });
    }

    await env.DB.prepare("UPDATE users SET favorites = ? WHERE id = ?")
      .bind(favorites, userId)
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
