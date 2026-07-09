-- migration.sql - เพิ่มระบบ Quests, Stars และ Global Chat

-- 1. เพิ่มคอลัมน์ในตาราง users
ALTER TABLE users ADD COLUMN stars INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN global_name TEXT;
ALTER TABLE users ADD COLUMN last_login_date TEXT;
ALTER TABLE users ADD COLUMN message_count INTEGER DEFAULT 0;

-- 2. เพิ่มคอลัมน์ในตาราง hints
ALTER TABLE hints ADD COLUMN star_cost INTEGER DEFAULT 0;

-- 3. สร้างตาราง global_messages สำหรับแชทโลก
CREATE TABLE IF NOT EXISTS global_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id TEXT,
  sender_name TEXT,
  text TEXT,
  timestamp TEXT,
  is_system INTEGER DEFAULT 0
);

-- 4. ตั้งค่า Config เริ่มต้นสำหรับ Global Chat และ Countdown
INSERT OR IGNORE INTO config (key, value) VALUES ('global_chat_start', '20:00');
INSERT OR IGNORE INTO config (key, value) VALUES ('global_chat_end', '22:00');
INSERT OR IGNORE INTO config (key, value) VALUES ('reveal_time', '2026-07-15T18:00:00Z');
