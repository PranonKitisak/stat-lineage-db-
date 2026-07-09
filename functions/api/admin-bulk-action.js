// functions/api/admin-bulk-action.js
export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });
  }

  try {
    const { adminId, action, value } = await request.json();

    // Verify admin role
    const adminUser = await env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(adminId).first();
    if (!adminUser || adminUser.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const val = value ? 1 : 0;

    if (action === 'reveal_lineages') {
      // Toggle all lineages
      await env.DB.prepare("UPDATE lineages SET revealed = ?").bind(val).run();
    } else if (action === 'reveal_special_hints') {
      // Toggle special hints for all lineages
      await env.DB.prepare("UPDATE lineages SET special_hint_revealed = ?").bind(val).run();
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
