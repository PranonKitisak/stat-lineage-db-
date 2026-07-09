// functions/api/guess.js
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: "DB missing" }), { status: 500, headers: { "Content-Type": "application/json" } });

  try {
    const { lineageId, type, guess } = await request.json();
    
    if (!lineageId || !type || !guess) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const senior = await env.DB.prepare("SELECT name, major, avatar, ig FROM users WHERE lineage_id = ? AND role = 'senior'").bind(lineageId).first();
    if (!senior) {
      return new Response(JSON.stringify({ error: "Senior not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    let correct = false;
    if (type === 'name') {
      correct = (guess.toLowerCase() === senior.name.toLowerCase());
    } else if (type === 'major') {
      correct = (guess === senior.major); // major is a dropdown, so exact match is fine
    }

    if (correct) {
      if (type === 'name') {
        // Revealing the name reveals the whole lineage
        await env.DB.prepare("UPDATE lineages SET revealed = 1 WHERE id = ?").bind(lineageId).run();
      }
      return new Response(JSON.stringify({ correct: true, senior }), { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      });
    } else {
      return new Response(JSON.stringify({ correct: false }), { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" } 
    });
  }
}
