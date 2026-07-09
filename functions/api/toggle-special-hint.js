// functions/api/toggle-special-hint.js
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });

  try {
    const { lineageId, revealed, userId } = await request.json();
    if (!lineageId) return new Response(JSON.stringify({ error: "Missing lineageId" }), { status: 400 });

    const config = await env.DB.prepare("SELECT value FROM config WHERE key = 'admin_allow_special_hint'").first();
    if (!config || config.value !== 'true') {
      return new Response(JSON.stringify({ error: "แอดมินยังไม่อนุญาตให้เปิดคำใบ้พิเศษ" }), { status: 403 });
    }

    if (userId && revealed) {
      const lineageState = await env.DB.prepare("SELECT special_hint_revealed FROM lineages WHERE id = ?").bind(lineageId).first();
      if (lineageState && lineageState.special_hint_revealed !== 1) {
        const user = await env.DB.prepare("SELECT stars FROM users WHERE id = ?").bind(userId).first();
        if (!user || user.stars < 20) {
          return new Response(JSON.stringify({ error: "ดาวไม่เพียงพอ (ต้องการ 20 ดาว)" }), { status: 400 });
        }
        await env.DB.prepare("UPDATE users SET stars = stars - 20 WHERE id = ?").bind(userId).run();
        const historyId = crypto.randomUUID();
        await env.DB.prepare("INSERT INTO star_history (id, user_id, amount, reason) VALUES (?, ?, ?, ?)")
          .bind(historyId, userId, -20, "ซื้อคำใบ้พิเศษ").run();
      }
    }

    await env.DB.prepare("UPDATE lineages SET special_hint_revealed = ? WHERE id = ?")
      .bind(revealed ? 1 : 0, lineageId)
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
