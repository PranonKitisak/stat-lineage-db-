// functions/api/lineages.js
// API สำหรับดึงข้อมูลสายรหัสทั้งหมด หรืออัปเดตสถานะเฉลย

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "ฐานข้อมูล D1 ไม่ได้เชื่อมต่อ" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  // GET METHOD
  if (request.method === "GET") {
    try {
      // 1. ดึงข้อมูลรายละเอียดของสายรหัสตัวเดียว (ถ้ามีระบุ ID)
      if (id) {
        const lineageResult = await env.DB.prepare(
          "SELECT * FROM lineages WHERE id = ?"
        )
        .bind(id)
        .first();

        if (!lineageResult) {
          return new Response(JSON.stringify({ error: "ไม่พบสายรหัสนี้" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }

        const seniorResult = await env.DB.prepare(
          "SELECT * FROM users WHERE lineage_id = ? AND role = 'senior'"
        )
        .bind(id)
        .first();

        const juniorsResults = await env.DB.prepare(
          "SELECT * FROM users WHERE lineage_id = ? AND role = 'junior' ORDER BY id ASC"
        )
        .bind(id)
        .all();

        const hintsResults = await env.DB.prepare(
          "SELECT hint_text FROM hints WHERE lineage_id = ? ORDER BY id ASC"
        )
        .bind(id)
        .all();
        const hints = hintsResults.results.map(h => h.hint_text);

        const chatResults = await env.DB.prepare(
          "SELECT * FROM messages WHERE lineage_id = ? ORDER BY id ASC"
        )
        .bind(id)
        .all();

        const lineageInfo = {
          id: lineageResult.id,
          revealed: lineageResult.revealed === 1,
          specialHint: lineageResult.special_hint,
          hints: hints,
          senior: seniorResult ? {
            id: seniorResult.id,
            email: seniorResult.email,
            name: seniorResult.name,
            major: seniorResult.major,
            avatar: seniorResult.avatar
          } : null,
          juniors: juniorsResults.results.map(j => ({
            id: j.id,
            email: j.email,
            name: j.name,
            major: j.major,
            avatar: j.avatar
          })),
          messages: chatResults.results.map(m => ({
            senderId: m.sender_id,
            senderName: m.sender_name,
            senderRole: m.sender_role,
            text: m.text,
            timestamp: m.timestamp
          }))
        };

        return new Response(JSON.stringify(lineageInfo), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // 2. ดึงข้อมูลรายชื่อสายรหัสทั้งหมด (ใช้แสดงใน Dev Tools / สลับบัญชีด่วน)
      const lineages = await env.DB.prepare("SELECT * FROM lineages ORDER BY id ASC").all();
      
      const detailedLineages = [];
      for (const lin of lineages.results) {
        const senior = await env.DB.prepare("SELECT * FROM users WHERE lineage_id = ? AND role = 'senior'").bind(lin.id).first();
        const juniors = await env.DB.prepare("SELECT * FROM users WHERE lineage_id = ? AND role = 'junior'").bind(lin.id).all();
        
        detailedLineages.push({
          id: lin.id,
          revealed: lin.revealed === 1,
          specialHint: lin.special_hint,
          senior: senior ? {
            id: senior.id,
            email: senior.email,
            name: senior.name,
            major: senior.major,
            avatar: senior.avatar
          } : null,
          juniors: juniors.results.map(j => ({
            id: j.id,
            email: j.email,
            name: j.name,
            major: j.major,
            avatar: j.avatar
          }))
        });
      }

      return new Response(JSON.stringify(detailedLineages), {
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

  // POST METHOD - จัดการเฉลย/ซ่อนตัวตนทีละสายรหัส (แอดมิน)
  if (request.method === "POST") {
    try {
      const { lineageId, revealed } = await request.json();
      
      await env.DB.prepare(
        "UPDATE lineages SET revealed = ? WHERE id = ?"
      )
      .bind(revealed ? 1 : 0, lineageId)
      .run();

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

  return new Response("Method not allowed", { status: 405 });
}
