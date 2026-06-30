// functions/api/reset.js
// API สำหรับการรีเซ็ตฐานข้อมูล D1 กลับเป็นค่าเริ่มต้นในระบบสาธิต

export async function onRequestPost(context) {
  const { env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "ฐานข้อมูล D1 ไม่ได้เชื่อมต่อ" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const queries = [
    "DROP TABLE IF EXISTS config",
    "DROP TABLE IF EXISTS lineages",
    "DROP TABLE IF EXISTS users",
    "DROP TABLE IF EXISTS hints",
    "DROP TABLE IF EXISTS messages",
    
    "CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT)",
    "CREATE TABLE lineages (id TEXT PRIMARY KEY, revealed INTEGER DEFAULT 0, special_hint TEXT)",
    "CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT, name TEXT, major TEXT, avatar TEXT, role TEXT, lineage_id TEXT)",
    "CREATE TABLE hints (id INTEGER PRIMARY KEY AUTOINCREMENT, lineage_id TEXT, hint_text TEXT)",
    "CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, lineage_id TEXT, sender_id TEXT, sender_name TEXT, sender_role TEXT, text TEXT, timestamp TEXT)",
    
    "INSERT INTO config (key, value) VALUES ('special_hints_revealed', 'false')",
    "INSERT INTO config (key, value) VALUES ('guessing_enabled', 'false')",
    
    "INSERT INTO lineages (id, revealed, special_hint) VALUES ('lineage-01', 0, 'พี่เคยแต่งคอสเพลย์เป็นจิ้งจอกเก้าหางมาทำข้อสอบกลางภาคในคณะ!')",
    "INSERT INTO users (id, email, name, major, avatar, role, lineage_id) VALUES ('6732001026', 'nick.wilde@gmail.com', 'พี่นิค (Nick Wilde)', 'สถิติสารสนเทศและการวิเคราะห์ข้อมูล (STAT)', '🦊', 'senior', 'lineage-01')",
    "INSERT INTO users (id, email, name, major, avatar, role, lineage_id) VALUES ('6832005042', 'judy.hopps@outlook.com', 'น้องจูดี้ (Judy Hopps)', 'สถิติสารสนเทศและการวิเคราะห์ข้อมูล (STAT)', '🐰', 'junior', 'lineage-01')",
    "INSERT INTO hints (lineage_id, hint_text) VALUES ('lineage-01', 'พี่ตัวสูงกว่าหนูอยู่นะ มีสีส้มๆ แดงๆ ในตัว (หรือเปล่า?)')",
    "INSERT INTO hints (lineage_id, hint_text) VALUES ('lineage-01', 'พี่ชอบดื่มน้ำบลูเบอร์รี่แยกกากเป็นชีวิตจิตใจ')",
    "INSERT INTO hints (lineage_id, hint_text) VALUES ('lineage-01', 'พี่มักจะชอบหยอกล้อคนอื่นด้วยท่วงท่าที่ดูเจ้าเล่ห์แต่จริงใจนะ!')",
    "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES ('lineage-01', '6732001026', 'พี่นิค (Nick Wilde)', 'senior', 'ยินดีต้อนรับสู่อ้อมกอดของสายรหัสสุดเจ๋งนะจ๊ะกระต่ายน้อย!', '2026-06-29T10:00:00.000Z')",
    "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES ('lineage-01', '6832005042', 'น้องจูดี้ (Judy Hopps)', 'junior', 'ขอบคุณค่ะพี่รหัส! หนูจะตามหาตัวพี่ให้เจอให้ได้เลยคอยดูสิ!', '2026-06-29T10:05:00.000Z')",
    "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES ('lineage-01', '6732001026', 'พี่นิค (Nick Wilde)', 'senior', 'หึๆ พยายามเข้าล่ะ แม่สาวน้อยผู้พิทักษ์สันติราษฎร์', '2026-06-29T10:10:00.000Z')",
    
    "INSERT INTO lineages (id, revealed, special_hint) VALUES ('lineage-02', 0, 'คำใบ้พิเศษคือ... พี่เคยเผลอทำแก้วชานมไข่มุกร่วงใส่เป๋าเป้เพื่อนรหัสตอนอยู่ปี 1 จ้า 5555')",
    "INSERT INTO users (id, email, name, major, avatar, role, lineage_id) VALUES ('6732002015', 'flash.sloth@gmail.com', 'พี่แฟลช (Flash Slothmore)', 'วิทยาการจัดการข้อมูล (Data Science)', '🦥', 'senior', 'lineage-02')",
    "INSERT INTO users (id, email, name, major, avatar, role, lineage_id) VALUES ('6832006011', 'priscilla.sloth@gmail.com', 'น้องพริสซิลลา (Priscilla Sloth)', 'วิทยาการจัดการข้อมูล (Data Science)', '🦦', 'junior', 'lineage-02')",
    "INSERT INTO users (id, email, name, major, avatar, role, lineage_id) VALUES ('6832006022', 'little.sheep@outlook.com', 'น้องแกะน้อย (Little Sheep)', 'การประกันภัย (Insurance)', '🐑', 'junior', 'lineage-02')",
    "INSERT INTO hints (lineage_id, hint_text) VALUES ('lineage-02', 'คำ... ใบ้... นี้... พิมพ์... ช้า... มาก... นะ... น้อง... รหัส...')",
    "INSERT INTO hints (lineage_id, hint_text) VALUES ('lineage-02', 'พี่ชอบสีเขียวเหนี่ยวทรัพย์ และชอบห้อยบัตรประจำตัวกลับด้าน')",
    "INSERT INTO hints (lineage_id, hint_text) VALUES ('lineage-02', 'พี่รักความเร็ว (ตอนขับรถ) แต่เวลาทำงาน... ขอตัวนอนแพล๊บบบ')",
    "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES ('lineage-02', '6732002015', 'พี่แฟลช (Flash Slothmore)', 'senior', 'ส... วั... ส... ด... ดี... จ้... า...', '2026-06-29T11:00:00.000Z')",
    "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES ('lineage-02', '6832006011', 'น้องพริสซิลลา (Priscilla Sloth)', 'junior', 'ส... วั... ส... ดี... ค่... ะ... พี่... ร... หั... ส...', '2026-06-29T11:02:00.000Z')",
    "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES ('lineage-02', '6832006022', 'น้องแกะน้อย (Little Sheep)', 'junior', 'หนูอ่านแชทแล้วเหนื่อยเลยค่ะ 5555555 สวัสดีค่ะพี่รหัส!', '2026-06-29T11:05:00.000Z')",
    "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES ('lineage-02', '6732002015', 'พี่แฟลช (Flash Slothmore)', 'senior', 'มี... น้... อ... ง... ส... อ... ง... ค... น... ดี... ใ... จ... จั... ง...', '2026-06-29T11:15:00.000Z')",
    
    "INSERT INTO lineages (id, revealed, special_hint) VALUES ('lineage-03', 0, 'พี่มีโมเดลฟิกเกอร์สารวัตรควายป่าสูงสองฟุตตั้งโชว์อยู่ในห้องนอน!')",
    "INSERT INTO users (id, email, name, major, avatar, role, lineage_id) VALUES ('6732003055', 'chief.bogo@gmail.com', 'พี่สารวัตรโบโก (Chief Bogo)', 'การประกันภัย (Insurance)', '🐃', 'senior', 'lineage-03')",
    "INSERT INTO users (id, email, name, major, avatar, role, lineage_id) VALUES ('6832007077', 'clawhauser.donut@gmail.com', 'น้องคลอฮาวเซอร์ (Clawhauser)', 'สถิติประยุกต์ (Applied Stat)', '🐆', 'junior', 'lineage-03')",
    "INSERT INTO hints (lineage_id, hint_text) VALUES ('lineage-03', 'พี่ตัวใหญ่และดูน่ากลัว แต่จริงๆ พี่เป็นคนใจดีและรักดนตรีคลาสสิกนะ')",
    "INSERT INTO hints (lineage_id, hint_text) VALUES ('lineage-03', 'พี่มักจะถือกาแฟแก้วใหญ่มากในคณะ')",
    "INSERT INTO hints (lineage_id, hint_text) VALUES ('lineage-03', 'พี่ไม่ชอบให้ใครมาล้อเรื่องเขาบนหัว!')",
    "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES ('lineage-03', '6732003055', 'พี่สารวัตรโบโก (Chief Bogo)', 'senior', 'ยินดีด้วยที่ได้มาอยู่สายนี้ อย่าสร้างปัญหาล่ะ ตั้งใจเรียนด้วย', '2026-06-29T12:00:00.000Z')",
    "INSERT INTO messages (lineage_id, sender_id, sender_name, sender_role, text, timestamp) VALUES ('lineage-03', '6832007077', 'น้องคลอฮาวเซอร์ (Clawhauser)', 'junior', 'รับทราบค่ะผู้การ! เอ้ย พี่รหัส! มีโดนัทต้อนรับน้องไหมคะเนี่ยยย 🍩', '2026-06-29T12:05:00.000Z')"
  ];

  try {
    // รัน SQL ทีละคำสั่ง
    for (const sql of queries) {
      await env.DB.prepare(sql).run();
    }

    return new Response(JSON.stringify({ success: true, message: "รีเซ็ตฐานข้อมูล D1 สำเร็จเรียบร้อย!" }), {
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
