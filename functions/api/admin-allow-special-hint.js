// functions/api/admin-allow-special-hint.js
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });

  try {
    const { allowed, adminId } = await request.json();
    
    // Check if user is admin
    const adminUser = await env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(adminId).first();
    if (!adminUser || adminUser.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    await env.DB.prepare("INSERT INTO config (key, value) VALUES ('admin_allow_special_hint', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
      .bind(allowed ? 'true' : 'false')
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
