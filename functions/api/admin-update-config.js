// functions/api/admin-update-config.js
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });

  try {
    const { adminId, key, value } = await request.json();
    
    // Check if user is admin
    const adminUser = await env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(adminId).first();
    if (!adminUser || adminUser.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    // Check if config exists, if so update, if not insert
    const existing = await env.DB.prepare("SELECT key FROM config WHERE key = ?").bind(key).first();
    
    if (existing) {
      await env.DB.prepare("UPDATE config SET value = ? WHERE key = ?").bind(value, key).run();
    } else {
      await env.DB.prepare("INSERT INTO config (key, value) VALUES (?, ?)").bind(key, value).run();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
