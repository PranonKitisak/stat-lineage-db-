export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const { userId, userName, role, problemText, contactInfo, email } = data;

    if (!userId || !problemText || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const { env } = context;
    const db = env.DB;

    // Combine email and contact info for the database record
    const combinedContact = `Email: ${email} | Other: ${contactInfo || '-'}`;

    // Save report to database
    await db.prepare(
      "INSERT INTO reports (user_id, user_name, role, problem_text, contact_info) VALUES (?, ?, ?, ?, ?)"
    ).bind(userId, userName || '', role || '', problemText, combinedContact).run();

    // Send Email via Resend if configured
    if (env.RESEND_API_KEY && env.RESEND_TO_EMAIL) {
      try {
        const htmlContent = `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #d32f2f;">🚨 มีรายงานปัญหาใหม่ในระบบ</h2>
            <p><strong>ผู้รายงาน:</strong> ${userName || userId} (บทบาท: ${role})</p>
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #d32f2f; margin: 15px 0;">
              <p style="margin: 0;"><strong>รายละเอียดปัญหา:</strong></p>
              <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${problemText}</p>
            </div>
            <p><strong>อีเมลติดต่อกลับ:</strong> ${email}</p>
            <p><strong>ข้อมูลติดต่ออื่นๆ:</strong> ${contactInfo || '-'}</p>
          </div>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: "Stat Lineage <onboarding@resend.dev>",
            to: env.RESEND_TO_EMAIL,
            subject: "🚨 มีรายงานปัญหาใหม่ในระบบสายรหัส",
            html: htmlContent
          })
        });
      } catch (emailErr) {
        console.error("Failed to send email:", emailErr);
        // We don't throw error here to ensure the API still returns success for saving the report
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'รายงานปัญหาสำเร็จ' }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
