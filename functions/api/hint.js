// functions/api/hint.js
// API สำหรับการจัดการคำใบ้ปกติ และคำใบ้พิเศษของพี่รหัส

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "ฐานข้อมูล D1 ไม่ได้เชื่อมต่อ" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { action, lineageId, hintText, index, specialHintText } = await request.json();

    // 1. เพิ่มคำใบ้ปกติ
    if (action === "add") {
      await env.DB.prepare(
        "INSERT INTO hints (lineage_id, hint_text) VALUES (?, ?)"
      )
      .bind(lineageId, hintText.trim())
      .run();

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. ลบคำใบ้ปกติ (ตามลำดับ Index)
    if (action === "delete") {
      const { results } = await env.DB.prepare(
        "SELECT id FROM hints WHERE lineage_id = ? ORDER BY id ASC"
      )
      .bind(lineageId)
      .all();

      if (results.length > index) {
        const targetId = results[index].id;
        await env.DB.prepare("DELETE FROM hints WHERE id = ?").bind(targetId).run();
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        return new Response(JSON.stringify({ error: "ไม่พบคำใบ้ที่ระบุ" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // 3. แก้ไขคำใบ้พิเศษ
    if (action === "updateSpecialHint") {
      await env.DB.prepare(
        "UPDATE lineages SET special_hint = ? WHERE id = ?"
      )
      .bind(specialHintText.trim(), lineageId)
      .run();

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "การทำงานไม่ถูกต้อง" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
