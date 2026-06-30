// functions/api/config.js
// API สำหรับดึงหรืออัปเดตระบบพิเศษสำหรับวันงาน (คำใบ้พิเศษ / ระบบทาย)

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "ฐานข้อมูล D1 ไม่ได้เชื่อมต่อ" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  // GET METHOD
  if (request.method === "GET") {
    try {
      const results = await env.DB.prepare("SELECT * FROM config").all();
      
      const config = {
        specialHintsRevealed: false,
        guessingEnabled: false
      };

      results.results.forEach(row => {
        if (row.key === "special_hints_revealed") {
          config.specialHintsRevealed = row.value === "true";
        } else if (row.key === "guessing_enabled") {
          config.guessingEnabled = row.value === "true";
        }
      });

      return new Response(JSON.stringify(config), {
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

  // POST METHOD - สำหรับแอดมินอัปเดตสถานะเปิด/ปิดระบบในวันงาน
  if (request.method === "POST") {
    try {
      const body = await request.json();
      
      if (body.hasOwnProperty("specialHintsRevealed")) {
        await env.DB.prepare("UPDATE config SET value = ? WHERE key = 'special_hints_revealed'")
          .bind(body.specialHintsRevealed ? "true" : "false")
          .run();
      }
      
      if (body.hasOwnProperty("guessingEnabled")) {
        await env.DB.prepare("UPDATE config SET value = ? WHERE key = 'guessing_enabled'")
          .bind(body.guessingEnabled ? "true" : "false")
          .run();
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

  return new Response("Method not allowed", { status: 405 });
}
