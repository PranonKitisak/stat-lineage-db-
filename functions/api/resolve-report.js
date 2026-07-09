export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const { id, adminId } = data;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing report id' }), { status: 400 });
    }

    const { env } = context;
    const db = env.DB;

    // Verify adminId if needed here...
    
    await db.prepare(
      "UPDATE reports SET status = 'resolved' WHERE id = ?"
    ).bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
