export async function onRequestGet(context) {
  try {
    const { env } = context;
    const db = env.DB;
    
    // In a real app we would verify the admin token here
    // For now we just return the reports
    const { results } = await db.prepare("SELECT * FROM reports ORDER BY created_at DESC").all();
    
    return new Response(JSON.stringify({ reports: results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
