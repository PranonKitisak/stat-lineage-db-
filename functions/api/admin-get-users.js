// functions/api/admin-get-users.js
export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });

  try {
    const url = new URL(request.url);
    const adminId = url.searchParams.get('adminId');

    const adminUser = await env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(adminId).first();
    if (!adminUser || adminUser.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const users = await env.DB.prepare("SELECT * FROM users WHERE role != 'admin'").all();
    const lineages = await env.DB.prepare("SELECT * FROM lineages").all();
    const hints = await env.DB.prepare("SELECT * FROM hints").all();

    return new Response(JSON.stringify({
      users: users.results,
      lineages: lineages.results,
      hints: hints.results
    }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
