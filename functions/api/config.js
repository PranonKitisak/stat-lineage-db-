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
        guessingEnabled: false,
        globalChatEnabled: false,
        adminAllowSpecialHint: false
      };

      results.results.forEach(row => {
        if (row.key === "special_hints_revealed") {
          config.specialHintsRevealed = row.value === "true";
        } else if (row.key === "guessing_enabled") {
          config.guessingEnabled = row.value === "true";
        } else if (row.key === "global_chat_enabled") {
          config.globalChatEnabled = row.value === "true";
        } else if (row.key === "admin_allow_special_hint") {
          config.adminAllowSpecialHint = row.value === "true";
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

  return new Response("Method not allowed", { status: 405 });
}
