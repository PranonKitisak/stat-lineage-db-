// functions/api/admin-update-hints.js
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });

  try {
    const { adminId, lineageId, specialHint, normalHints } = await request.json();
    
    const adminUser = await env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(adminId).first();
    if (!adminUser || adminUser.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    // Update special hint
    await env.DB.prepare("UPDATE lineages SET special_hint = ? WHERE id = ?")
      .bind(specialHint, lineageId)
      .run();

    // Normal hints
    if (normalHints && Array.isArray(normalHints)) {
      // simple approach: delete old and insert new, or update existing. 
      // Since it's exactly 3 hints, we can just clear and insert.
      await env.DB.prepare("DELETE FROM hints WHERE lineage_id = ?").bind(lineageId).run();
      
      const insertStmt = env.DB.prepare("INSERT INTO hints (lineage_id, hint_text) VALUES (?, ?)");
      const batchStmts = normalHints.filter(h => h.trim() !== '').map(h => insertStmt.bind(lineageId, h));
      
      if (batchStmts.length > 0) {
        await env.DB.batch(batchStmts);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
