// database.js - ข้อมูลจำลองสายรหัส (สำหรับ dev-drawer และ fallback)

const INITIAL_LINEAGES = [
  {
    "id": "lineage-6842002526",
    "revealed": false,
    "specialHint": "พี่ใส่แว่น ชื่อมีอ.",
    "hints": [
      "🫪/🖥️/👂"
    ],
    "senior": {
      "id": "6842002526",
      "email": "6842002526@student.chula.ac.th",
      "name": "กอล์ฟ",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "719440"
    },
    "juniors": [
      {
        "id": "6940000126",
        "email": "B1@gmail.com",
        "name": "A1",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "561162",
        "ig": "C1",
        "photoUrl": "/images/juniors/6940000126.jpg",
        "favorites": "D1"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842003126",
    "revealed": false,
    "specialHint": "ทิงเกอร์เบลล์ ",
    "hints": [
      "⭐️/🎄/♥️"
    ],
    "senior": {
      "id": "6842003126",
      "email": "bellkanchaya.22@gmail.com",
      "name": "เบลล์",
      "major": "ประกันภัย (INS)",
      "password": "871262"
    },
    "juniors": [
      {
        "id": "6940000226",
        "email": "B2@gmail.com",
        "name": "A2",
        "major": "ประกันภัย (INS)",
        "password": "482255",
        "ig": "C2",
        "photoUrl": "/images/juniors/6940000226.jpg",
        "favorites": "D2"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842006026",
    "revealed": false,
    "specialHint": "ใบเซียมซีที่ 59 ดวงชะตาชี้ชัดพบลักษณะคู่ของท่านดั่งนี้ เป็นโฉมตรูนารีผู้ปรีชา สถิตอยู่สถิติสาขาพาสุขศานต์ กำเนิดดาววันจันทร์อนงค์นาฏ ชะตาชาติราศีเมถุนเกื้อหนุนนำ รูปกายสง่าสูงร้อยหกสิบแปดเซนติเมตร เกศาดำยาวถึงอกตกต้องจิต ฤทัยคิดชอบพึงซึ่งสีม่วง อีกทั้งปวงมวลบุปผาดลพาฝัน ชอบอ่านหนังสือเรียนรู้ทุกวารวัน ยามว่างนั้นชอบถ่ายภาพสลักตรึง ส่วนอาหารโปรดปรานจานแป้งเส้น ติดตัวเป็นพกลูกอมไว้ขบเคี้ยว หากแม้นตามหาคนผู้นี้พบเจอในวัน จะเกิดลาภผลอันประเสริฐแก่ตัวท่านเองเอยฯ",
    "hints": [
      "🌙♊️♨️"
    ],
    "senior": {
      "id": "6842006026",
      "email": "yukikwanchan@gmail.com",
      "name": "ยุกิ",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "485576"
    },
    "juniors": [
      {
        "id": "6940000326",
        "email": "B3@gmail.com",
        "name": "A3",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "338057",
        "ig": "C3",
        "photoUrl": "/images/juniors/6940000326.jpg",
        "favorites": "D3"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842007726",
    "revealed": false,
    "specialHint": "เหนียวไก่ใส่แว่น",
    "hints": [
      "🦭/🩵/💤"
    ],
    "senior": {
      "id": "6842007726",
      "email": "kanisorn1502@gmail.com",
      "name": "ฟ้าใส",
      "major": "ประกันภัย (INS)",
      "password": "765689"
    },
    "juniors": [
      {
        "id": "6940000426",
        "email": "B4@gmail.com",
        "name": "A4",
        "major": "ประกันภัย (INS)",
        "password": "865554",
        "ig": "C4",
        "photoUrl": "/images/juniors/6940000426.jpg",
        "favorites": "D4"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842008326",
    "revealed": false,
    "specialHint": "หวัดดีคับ หวัดดีใคร หวัดดีเราอะแหน่่่ รู้ยังพี่คือใครรร ถ้ายังไม่รู้เดี๋ยวใบ้ให้เพิ่ม ิิ พี่เป้นผู้หญิง ไม่ได้อยู่สาขาประกัน หูววว รู้เลยอะดิว่าใคร เข้ามาทักพี่โลดดด พี่แอบมองอยู่นะ👀 ถ้าไม่รู้จิงๆยืนทำจุ๊บเหมียวทีนึงเดียวพี่ไปเฉลยเลอออ🤟🏻",
    "hints": [
      "🐶↗️"
    ],
    "senior": {
      "id": "6842008326",
      "email": "janejidapa411@gmail.com",
      "name": "เจน",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "930706"
    },
    "juniors": [
      {
        "id": "6940000526",
        "email": "B5@gmail.com",
        "name": "A5",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "419395",
        "ig": "C5",
        "photoUrl": "/images/juniors/6940000526.jpg",
        "favorites": "D5"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842009026",
    "revealed": false,
    "specialHint": "น้องชอบดูการ์ตูนมั้ย?",
    "hints": [
      "👱🏻‍♀️/🐴/⚪"
    ],
    "senior": {
      "id": "6842009026",
      "email": "maxjiv2@gmail.com",
      "name": "แม็กซ์",
      "major": "ประกันภัย (INS)",
      "password": "606632"
    },
    "juniors": [
      {
        "id": "6940000626",
        "email": "B6@gmail.com",
        "name": "A6",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "750433",
        "ig": "C6",
        "photoUrl": "/images/juniors/6940000626.jpg",
        "favorites": "D6"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842011126",
    "revealed": false,
    "specialHint": "เมื่อก่อนผมทอง🙅🏼‍♀️",
    "hints": [
      "🐇🍵🎀"
    ],
    "senior": {
      "id": "6842011126",
      "email": "preme020@gmail.com",
      "name": "พรีม",
      "major": "ประกันภัย (INS)",
      "password": "810511"
    },
    "juniors": [
      {
        "id": "6940000726",
        "email": "B7@gmail.com",
        "name": "A7",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "960675",
        "ig": "C7",
        "photoUrl": "/images/juniors/6940000726.jpg",
        "favorites": "D7"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842013426",
    "revealed": false,
    "specialHint": "อิงฟ้า",
    "hints": [
      "🐷"
    ],
    "senior": {
      "id": "6842013426",
      "email": "wunsen2415@gmail.com",
      "name": "วุ้นเส้น",
      "major": "ประกันภัย (INS)",
      "password": "754269"
    },
    "juniors": [
      {
        "id": "6940000826",
        "email": "B8@gmail.com",
        "name": "A8",
        "major": "ประกันภัย (INS)",
        "password": "539857",
        "ig": "C8",
        "photoUrl": "/images/juniors/6940000826.jpg",
        "favorites": "D8"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842014026",
    "revealed": false,
    "specialHint": "458739 284621, \"0 เป็นเลขคู่ 1 เป็นเลขคี่ ค้นหาตัวย่อจาก 1 ใน 44\"",
    "hints": [
      "✅️/🍔/🃏"
    ],
    "senior": {
      "id": "6842014026",
      "email": "tiggertig09@gmail.com",
      "name": "ทิกเกอร์",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "723895"
    },
    "juniors": [
      {
        "id": "6940000926",
        "email": "B9@gmail.com",
        "name": "A9",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "247687",
        "ig": "C9",
        "photoUrl": "/images/juniors/6940000926.jpg",
        "favorites": "D9"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842015726",
    "revealed": false,
    "specialHint": "12.011, 100, 67, 3 ชื่อง่ายสุดๆ ไม่ใช่คำไทย",
    "hints": [
      "🍫🐈🏖"
    ],
    "senior": {
      "id": "6842015726",
      "email": "chawapon101@gmail.com",
      "name": "ซี",
      "major": "ประกันภัย (INS)",
      "password": "929710"
    },
    "juniors": [
      {
        "id": "6940001026",
        "email": "B10@gmail.com",
        "name": "A10",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "141703",
        "ig": "C10",
        "photoUrl": "/images/juniors/6940001026.jpg",
        "favorites": "D10"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842016326",
    "revealed": false,
    "specialHint": "มีเกลียวคลื่นสีเข้มอยู่บนหัว รูปร่างเหมือนก้อนโมจิสีขาว หากอยากรู้ว่าฉันคือใคร ให้ตามหาสิ่งที่ซ่อนอยู่ในชามยำ ตอนดิบเป็นสีขาวตอนสุกเป็นสีใส",
    "hints": [
      "🍜/🍼/🍣"
    ],
    "senior": {
      "id": "6842016326",
      "email": "chanyanat.cnc@gmail.com",
      "name": "วุ้นเส้น",
      "major": "ประกันภัย (INS)",
      "password": "321848"
    },
    "juniors": [
      {
        "id": "6940001126",
        "email": "B11@gmail.com",
        "name": "A11",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "421680",
        "ig": "C11",
        "photoUrl": "/images/juniors/6940001126.jpg",
        "favorites": "D11"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842017026",
    "revealed": false,
    "specialHint": "สวัสดีน้องรหัส พี่รหัสเอง คำใบ้คือ เอ่อ พี่คิดไม่ออก พี่นอนวันละ10ชั่วโมง วากุริน่ารักที่สุด*อันนี้สำคัญ เป็นอินโทรเวิด ติดเกมจัด นี่คำใบ้อีกอัน(-- --- --- -.) ไปคิดเอาเองนะน้องสู้ๆ",
    "hints": [
      "🏞🎮🎧"
    ],
    "senior": {
      "id": "6842017026",
      "email": "nofeeltt@gmail.com",
      "name": "ธาริณ",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "304777"
    },
    "juniors": [
      {
        "id": "6940001226",
        "email": "B12@gmail.com",
        "name": "A12",
        "major": "ประกันภัย (INS)",
        "password": "477637",
        "ig": "C12",
        "photoUrl": "/images/juniors/6940001226.jpg",
        "favorites": "D12"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842019226",
    "revealed": false,
    "specialHint": "เก็บไว้ในตู้เย็น",
    "hints": [
      "🐕"
    ],
    "senior": {
      "id": "6842019226",
      "email": "ipeach491@gmail.com",
      "name": "เนย",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "433621"
    },
    "juniors": [
      {
        "id": "6940001326",
        "email": "B13@gmail.com",
        "name": "A13",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "969785",
        "ig": "C13",
        "photoUrl": "/images/juniors/6940001326.jpg",
        "favorites": "D13"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842020826",
    "revealed": false,
    "specialHint": "ใส่แว่น รักการฟังเพลงเป็นชีวิตจิตใจ",
    "hints": [
      "🐽/🎤/🎮"
    ],
    "senior": {
      "id": "6842020826",
      "email": "yaninnoei12345@gmail.com",
      "name": "เนย",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "618893"
    },
    "juniors": [
      {
        "id": "6940001426",
        "email": "B14@gmail.com",
        "name": "A14",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "819868",
        "ig": "C14",
        "photoUrl": "/images/juniors/6940001426.jpg",
        "favorites": "D14"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842021426",
    "revealed": false,
    "specialHint": "พูดน้อย เรียบร้อย น่ารัก ไม่…(แค่2ข้อแรกนา งื้อ)",
    "hints": [
      "🤤 🦥 🔇"
    ],
    "senior": {
      "id": "6842021426",
      "email": "yadawannakul@gmail.com",
      "name": "หยก",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "664689"
    },
    "juniors": [
      {
        "id": "6940001526",
        "email": "B15@gmail.com",
        "name": "A15",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "682607",
        "ig": "C15",
        "photoUrl": "/images/juniors/6940001526.jpg",
        "favorites": "D15"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842022026",
    "revealed": false,
    "specialHint": "พี่อยากเป็นเต่ายักษ์นอนแช่โคลนนนน",
    "hints": [
      "🧋🥑📳"
    ],
    "senior": {
      "id": "6842022026",
      "email": "6842022026@student.chula.ac.th",
      "name": "นุ้ย",
      "major": "ประกันภัย (INS)",
      "password": "567498"
    },
    "juniors": [
      {
        "id": "6940001626",
        "email": "B16@gmail.com",
        "name": "A16",
        "major": "ประกันภัย (INS)",
        "password": "103066",
        "ig": "C16",
        "photoUrl": "/images/juniors/6940001626.jpg",
        "favorites": "D16"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842023726",
    "revealed": false,
    "specialHint": "ใส่แว่น ติดเกม ",
    "hints": [
      "😭🤷‍♂️❓"
    ],
    "senior": {
      "id": "6842023726",
      "email": "Saisworking4@gmail.com",
      "name": "สาธุ",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "896917"
    },
    "juniors": [
      {
        "id": "6940001726",
        "email": "B17@gmail.com",
        "name": "A17",
        "major": "ประกันภัย (INS)",
        "password": "786433",
        "ig": "C17",
        "photoUrl": "/images/juniors/6940001726.jpg",
        "favorites": "D17"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842024326",
    "revealed": false,
    "specialHint": "ใหญ่ๆ อยู่แถวนี้แหละ ไม่ได้ไปไหนไกล",
    "hints": [
      "🌎🦒"
    ],
    "senior": {
      "id": "6842024326",
      "email": "navindanamson02@gmail.com",
      "name": "เอเชีย",
      "major": "ประกันภัย (INS)",
      "password": "928400"
    },
    "juniors": [
      {
        "id": "6940001826",
        "email": "B18@gmail.com",
        "name": "A18",
        "major": "ประกันภัย (INS)",
        "password": "173811",
        "ig": "C18",
        "photoUrl": "/images/juniors/6940001826.jpg",
        "favorites": "D18"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842025026",
    "revealed": false,
    "specialHint": "คิดว่าพี่คนไหนน่ากลัว ลองเข้ามาทักดู เจอกันครับเบ่บี๋",
    "hints": [
      "👉🏻🫖🍵"
    ],
    "senior": {
      "id": "6842025026",
      "email": "nichakieat@gmail.com",
      "name": "ณิชา",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "822033"
    },
    "juniors": [
      {
        "id": "6940001926",
        "email": "B19@gmail.com",
        "name": "A19",
        "major": "ประกันภัย (INS)",
        "password": "693756",
        "ig": "C19",
        "photoUrl": "/images/juniors/6940001926.jpg",
        "favorites": "D19"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842026626",
    "revealed": false,
    "specialHint": "เปรี้ยวๆๆๆๆๆๆ",
    "hints": [
      "🍋/👓/💟"
    ],
    "senior": {
      "id": "6842026626",
      "email": "natchaya070502@gmail.com",
      "name": "เลม่อน",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "323741"
    },
    "juniors": [
      {
        "id": "6940002026",
        "email": "B20@gmail.com",
        "name": "A20",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "975956",
        "ig": "C20",
        "photoUrl": "/images/juniors/6940002026.jpg",
        "favorites": "D20"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842027226",
    "revealed": false,
    "specialHint": "ล็อกเป้าหมาย เล็งเป้า จู่โจม สาขาพี่ 01000010 01001001 01010100",
    "hints": [
      "🎶🕛🌧️"
    ],
    "senior": {
      "id": "6842027226",
      "email": "aemaem.0503@gmail.com",
      "name": "เอม",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "751663"
    },
    "juniors": [
      {
        "id": "6940002126",
        "email": "B21@gmail.com",
        "name": "A21",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "812418",
        "ig": "C21",
        "photoUrl": "/images/juniors/6940002126.jpg",
        "favorites": "D21"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842028926",
    "revealed": false,
    "specialHint": "-ไม่ได้ผมดำ👀 -อิโมจิตัวนึงเกี่ยวกับสัญลักษณ์ อีกสองตัวคือสี",
    "hints": [
      "🌸🍀🌠"
    ],
    "senior": {
      "id": "6842028926",
      "email": "6842028926@cbs.chula.ac.th",
      "name": "เกรท",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "122179"
    },
    "juniors": [
      {
        "id": "6940002226",
        "email": "B22@gmail.com",
        "name": "A22",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "133531",
        "ig": "C22",
        "photoUrl": "/images/juniors/6940002226.jpg",
        "favorites": "D22"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842029526",
    "revealed": false,
    "specialHint": "Thanksgiving Day",
    "hints": [
      "🤍🖤👩‍🎤"
    ],
    "senior": {
      "id": "6842029526",
      "email": "6842029526@student.chula.ac.th",
      "name": "โอลิเวีย",
      "major": "ประกันภัย (INS)",
      "password": "636556"
    },
    "juniors": [
      {
        "id": "6940002326",
        "email": "B23@gmail.com",
        "name": "A23",
        "major": "ประกันภัย (INS)",
        "password": "258964",
        "ig": "C23",
        "photoUrl": "/images/juniors/6940002326.jpg",
        "favorites": "D23"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842032326",
    "revealed": false,
    "specialHint": "ผม ผม ผม โผ้ม",
    "hints": [
      "😭✌️🤪"
    ],
    "senior": {
      "id": "6842032326",
      "email": "kormasikrub@gmail.com",
      "name": "ทิม",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "349788"
    },
    "juniors": [
      {
        "id": "6940002426",
        "email": "B24@gmail.com",
        "name": "A24",
        "major": "ประกันภัย (INS)",
        "password": "847679",
        "ig": "C24",
        "photoUrl": "/images/juniors/6940002426.jpg",
        "favorites": "D24"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842034626",
    "revealed": false,
    "specialHint": "ฟ",
    "hints": [
      "👨‍🌾"
    ],
    "senior": {
      "id": "6842034626",
      "email": "poimarpai02@gmail.com",
      "name": "ฟาร์ม",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "820539"
    },
    "juniors": [
      {
        "id": "6940002526",
        "email": "B25@gmail.com",
        "name": "A25",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "459364",
        "ig": "C25",
        "photoUrl": "/images/juniors/6940002526.jpg",
        "favorites": "D25"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842035226",
    "revealed": false,
    "specialHint": "เวลาเธอยิ้ม-Poly🐱 !? / ขอโทษที่เกิดเป็น Superstarห์ / https://youtu.be/KWhIaytWsms?si=B4SPY-W1oCTzfJJQ",
    "hints": [
      "🕳️/🚶🏼‍♀️/➿"
    ],
    "senior": {
      "id": "6842035226",
      "email": "thanakrit292549@gmail.com",
      "name": "โมเดล",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "895868"
    },
    "juniors": [
      {
        "id": "6940002626",
        "email": "B26@gmail.com",
        "name": "A26",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "875995",
        "ig": "C26",
        "photoUrl": "/images/juniors/6940002626.jpg",
        "favorites": "D26"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842036926",
    "revealed": false,
    "specialHint": "พี่เปนพี่กลุ่ม",
    "hints": [
      "🐣🏃😴"
    ],
    "senior": {
      "id": "6842036926",
      "email": "kaewplubthanatep@gmail.com",
      "name": "เอเซีย",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "317491"
    },
    "juniors": [
      {
        "id": "6940002726",
        "email": "B27@gmail.com",
        "name": "A27",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "189862",
        "ig": "C27",
        "photoUrl": "/images/juniors/6940002726.jpg",
        "favorites": "D27"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842037526",
    "revealed": false,
    "specialHint": "พี่ติ๋มม",
    "hints": [
      "🤐/💪🏻/🍗"
    ],
    "senior": {
      "id": "6842037526",
      "email": "thanatadpeem@gmail.com",
      "name": "ภีม",
      "major": "ประกันภัย (INS)",
      "password": "640146"
    },
    "juniors": [
      {
        "id": "6940002826",
        "email": "B28@gmail.com",
        "name": "A28",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "571648",
        "ig": "C28",
        "photoUrl": "/images/juniors/6940002826.jpg",
        "favorites": "D28"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842040326",
    "revealed": false,
    "specialHint": "มูเต้ะ",
    "hints": [
      "🌸/🩵/🐰"
    ],
    "senior": {
      "id": "6842040326",
      "email": "thanaphorn.katasila@gmail.com",
      "name": "มิ้ว",
      "major": "ประกันภัย (INS)",
      "password": "896714"
    },
    "juniors": [
      {
        "id": "6940002926",
        "email": "B29@gmail.com",
        "name": "A29",
        "major": "ประกันภัย (INS)",
        "password": "523628",
        "ig": "C29",
        "photoUrl": "/images/juniors/6940002926.jpg",
        "favorites": "D29"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842041026",
    "revealed": false,
    "specialHint": "หันหลังมาน้อง",
    "hints": [
      "😏😎😗"
    ],
    "senior": {
      "id": "6842041026",
      "email": "tel.0831415619@gmail.com",
      "name": "จ้า",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "516356"
    },
    "juniors": [
      {
        "id": "6940003026",
        "email": "B30@gmail.com",
        "name": "A30",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "953473",
        "ig": "C30",
        "photoUrl": "/images/juniors/6940003026.jpg",
        "favorites": "D30"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842042626",
    "revealed": false,
    "specialHint": "L'Inverno Largo",
    "hints": [
      "💻/🚁/🎻"
    ],
    "senior": {
      "id": "6842042626",
      "email": "6842042626@student.chula.ac.th",
      "name": "เตอร์",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "545912"
    },
    "juniors": [
      {
        "id": "6940003126",
        "email": "B31@gmail.com",
        "name": "A31",
        "major": "ประกันภัย (INS)",
        "password": "951917",
        "ig": "C31",
        "photoUrl": "/images/juniors/6940003126.jpg",
        "favorites": "D31"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842043226",
    "revealed": false,
    "specialHint": "ขอโทษนะ พี่ไม่ได้ไปงานแต่เดี๋ยวเลี้ยงน้ำนะ",
    "hints": [
      "🐸🚗"
    ],
    "senior": {
      "id": "6842043226",
      "email": "ford32350@gmail.com",
      "name": "ฟอร์ด",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "250873"
    },
    "juniors": [
      {
        "id": "6940003226",
        "email": "B32@gmail.com",
        "name": "A32",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "918144",
        "ig": "C32",
        "photoUrl": "/images/juniors/6940003226.jpg",
        "favorites": "D32"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842045526",
    "revealed": false,
    "specialHint": "พี่เป็นผู้ชายหรือผู้หญิงนั้นก็สุดแล้วแต่น้องจะหยั่งรู้ ชื่อพยางค์เดียวจ้ะ แล้วก็อะไรอีกดี ฮั่นแน่ อยากรู้อะไรบ้าง อิ_อิ ผมพี่ไม่สีฉูดฉาด เล็บก็สีไม่ฉูดฉาด ชอบเต้นสัน ที่เหลือหาคำตอบเพิ่มเองนะลูกเอ๊ย มาคุยกับพี่เยอะๆๆๆ พี่ใจดีจะตาย ไม่นานเดี๋ยวก็รู้ว่าพี่คือใคร",
    "hints": [
      "💃🏻/😻/🫪"
    ],
    "senior": {
      "id": "6842045526",
      "email": "nhapisa.kws@gmail.com",
      "name": "พลอย",
      "major": "ประกันภัย (INS)",
      "password": "783364"
    },
    "juniors": [
      {
        "id": "6940003326",
        "email": "B33@gmail.com",
        "name": "A33",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "369374",
        "ig": "C33",
        "photoUrl": "/images/juniors/6940003326.jpg",
        "favorites": "D33"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842047826",
    "revealed": false,
    "specialHint": "1. Aka บอนจิมามี่ 2. 🚦 3. เคยย้อมผม",
    "hints": [
      "🌊🐒🏋️"
    ],
    "senior": {
      "id": "6842047826",
      "email": "jjnrsurakit@gmail.com",
      "name": "เจมส์",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "816827"
    },
    "juniors": [
      {
        "id": "6940003426",
        "email": "B34@gmail.com",
        "name": "A34",
        "major": "ประกันภัย (INS)",
        "password": "876666",
        "ig": "C34",
        "photoUrl": "/images/juniors/6940003426.jpg",
        "favorites": "D34"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842049026",
    "revealed": false,
    "specialHint": "เราเคยเจอกัน",
    "hints": [
      "🐯/👩‍💻/🧜‍♀️"
    ],
    "senior": {
      "id": "6842049026",
      "email": "nanthichabuaklee@gmail.com",
      "name": "แตงโม",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "317513"
    },
    "juniors": [
      {
        "id": "6940003526",
        "email": "B35@gmail.com",
        "name": "A35",
        "major": "ประกันภัย (INS)",
        "password": "978159",
        "ig": "C35",
        "photoUrl": "/images/juniors/6940003526.jpg",
        "favorites": "D35"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842050626",
    "revealed": false,
    "specialHint": "พี่อาจจะเป็นคนเงียบ ๆ พูดไม่เก่ง (รึป่าวน้าาา) ชอบซามอยด์มากกก เหมือนตุ๊กตาหมีหิมะเลยเนอะ แถมน่ากอดอีก>< พี่ชอบหมาสุด ๆ เลยล่ะ อ้อ ละก็พึ่ชอบดอกทานตะวันด้วย ิิ 🔴+🔵=? (อ๋อ สีคณะเราเอง)",
    "hints": [
      "📸/🐶/🌌"
    ],
    "senior": {
      "id": "6842050626",
      "email": "jojokrabi2244@gmail.com",
      "name": "โจโจ",
      "major": "ประกันภัย (INS)",
      "password": "184878"
    },
    "juniors": [
      {
        "id": "6940003626",
        "email": "B36@gmail.com",
        "name": "A36",
        "major": "ประกันภัย (INS)",
        "password": "147845",
        "ig": "C36",
        "photoUrl": "/images/juniors/6940003626.jpg",
        "favorites": "D36"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842051226",
    "revealed": false,
    "specialHint": "01100010 01101101",
    "hints": [
      "🧏🏼‍♂️/🤓/🛞"
    ],
    "senior": {
      "id": "6842051226",
      "email": "papawin.bm2549@gmail.com",
      "name": "บีเอ็ม",
      "major": "ประกันภัย (INS)",
      "password": "513032"
    },
    "juniors": [
      {
        "id": "6940003726",
        "email": "B37@gmail.com",
        "name": "A37",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "283704",
        "ig": "C37",
        "photoUrl": "/images/juniors/6940003726.jpg",
        "favorites": "D37"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842052926",
    "revealed": false,
    "specialHint": "หันหลังมา",
    "hints": [
      "🖊️🫵🏻🦅"
    ],
    "senior": {
      "id": "6842052926",
      "email": "pranonkitisak2010@gmail.com",
      "name": "ปัน",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "247044"
    },
    "juniors": [
      {
        "id": "6940003826",
        "email": "B38@gmail.com",
        "name": "A38",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "603097",
        "ig": "C38",
        "photoUrl": "/images/juniors/6940003826.jpg",
        "favorites": "D38"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842053526",
    "revealed": false,
    "specialHint": "ตั้งใจจุ่ม",
    "hints": [
      "🦔🫐🪷"
    ],
    "senior": {
      "id": "6842053526",
      "email": "paladta6223@gmail.com",
      "name": "พริ้ม",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "293859"
    },
    "juniors": [
      {
        "id": "6940003926",
        "email": "B39@gmail.com",
        "name": "A39",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "683301",
        "ig": "C39",
        "photoUrl": "/images/juniors/6940003926.jpg",
        "favorites": "D39"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842054126",
    "revealed": false,
    "specialHint": "คนรู้ไม่พูด คนพูดไม่รู้",
    "hints": [
      "😴😚🐶"
    ],
    "senior": {
      "id": "6842054126",
      "email": "plykulphaichit@gmail.com",
      "name": "ปลาย",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "785958"
    },
    "juniors": [
      {
        "id": "6940004026",
        "email": "B40@gmail.com",
        "name": "A40",
        "major": "ประกันภัย (INS)",
        "password": "932644",
        "ig": "C40",
        "photoUrl": "/images/juniors/6940004026.jpg",
        "favorites": "D40"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842055826",
    "revealed": false,
    "specialHint": "ชาไทยใจรักกุ้ง",
    "hints": [
      "🍤/ 👧🏻/👩‍🏫"
    ],
    "senior": {
      "id": "6842055826",
      "email": "pleamsirinok@gmail.com",
      "name": "ปลื้ม",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "644427"
    },
    "juniors": [
      {
        "id": "6940004126",
        "email": "B41@gmail.com",
        "name": "A41",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "990137",
        "ig": "C41",
        "photoUrl": "/images/juniors/6940004126.jpg",
        "favorites": "D41"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842056426",
    "revealed": false,
    "specialHint": "จุดรวมแสง🪞",
    "hints": [
      "👄💪🏻👊🏻"
    ],
    "senior": {
      "id": "6842056426",
      "email": "paveenapat.pk400@gmail.com",
      "name": "โฟกัส",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "490552"
    },
    "juniors": [
      {
        "id": "6940004226",
        "email": "B42@gmail.com",
        "name": "A42",
        "major": "ประกันภัย (INS)",
        "password": "934799",
        "ig": "C42",
        "photoUrl": "/images/juniors/6940004226.jpg",
        "favorites": "D42"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842058726",
    "revealed": false,
    "specialHint": "กินได้นะ จอยๆฮะ",
    "hints": [
      "🤓🥡🀄️"
    ],
    "senior": {
      "id": "6842058726",
      "email": "panutkts@gmail.com",
      "name": "ติ่มซำ",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "611108"
    },
    "juniors": [
      {
        "id": "6940004326",
        "email": "B43@gmail.com",
        "name": "A43",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "210308",
        "ig": "C43",
        "photoUrl": "/images/juniors/6940004326.jpg",
        "favorites": "D43"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842059326",
    "revealed": false,
    "specialHint": "XO Lens: 180mm f/2005",
    "hints": [
      "📸🕶️🌃"
    ],
    "senior": {
      "id": "6842059326",
      "email": "tonysaego@gmail.com",
      "name": "เติ้ล",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "869266"
    },
    "juniors": [
      {
        "id": "6940004426",
        "email": "B44@gmail.com",
        "name": "A44",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "531924",
        "ig": "C44",
        "photoUrl": "/images/juniors/6940004426.jpg",
        "favorites": "D44"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842061526",
    "revealed": false,
    "specialHint": "-... .. - พี่คือคนนั้นแหละ คนที่ดอลลี่อายเด่นๆ คายเบบี้",
    "hints": [
      "🐘🌸🪵"
    ],
    "senior": {
      "id": "6842061526",
      "email": "kluaymaikm2006@gmail.com",
      "name": "กล้วยไม้",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "267582"
    },
    "juniors": [
      {
        "id": "6940004526",
        "email": "B45@gmail.com",
        "name": "A45",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "791282",
        "ig": "C45",
        "photoUrl": "/images/juniors/6940004526.jpg",
        "favorites": "D45"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842062126",
    "revealed": false,
    "specialHint": "พิกัดลับ",
    "hints": [
      "🐴/🩸/🤰"
    ],
    "senior": {
      "id": "6842062126",
      "email": "cherrypntt@gmail.com",
      "name": "เชอรี่",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "425555"
    },
    "juniors": [
      {
        "id": "6940004626",
        "email": "B46@gmail.com",
        "name": "A46",
        "major": "ประกันภัย (INS)",
        "password": "626083",
        "ig": "C46",
        "photoUrl": "/images/juniors/6940004626.jpg",
        "favorites": "D46"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842064426",
    "revealed": false,
    "specialHint": "2111xx13xxDM📷🏃🏻🇨🇳",
    "hints": [
      "🍣✈️📸"
    ],
    "senior": {
      "id": "6842064426",
      "email": "p.phollapat23@gmail.com",
      "name": "ต้นน้ำ",
      "major": "ประกันภัย (INS)",
      "password": "462093"
    },
    "juniors": [
      {
        "id": "6940004726",
        "email": "B47@gmail.com",
        "name": "A47",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "169478",
        "ig": "C47",
        "photoUrl": "/images/juniors/6940004726.jpg",
        "favorites": "D47"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842066726",
    "revealed": false,
    "specialHint": "หน้าตาไม่ใช่สิ่งสำคัญที่สุดในเรื่องของฉัน",
    "hints": [
      "🦋📚🌹"
    ],
    "senior": {
      "id": "6842066726",
      "email": "Panchitabelle150550@gmail.com",
      "name": "เบลล์",
      "major": "ประกันภัย (INS)",
      "password": "423120"
    },
    "juniors": [
      {
        "id": "6940004826",
        "email": "B48@gmail.com",
        "name": "A48",
        "major": "ประกันภัย (INS)",
        "password": "124707",
        "ig": "C48",
        "photoUrl": "/images/juniors/6940004826.jpg",
        "favorites": "D48"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842067326",
    "revealed": false,
    "specialHint": "-... .. -",
    "hints": [
      "👓/🍣/🐱"
    ],
    "senior": {
      "id": "6842067326",
      "email": "6842067326@student.chula.ac.th",
      "name": "แก้ม",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "549505"
    },
    "juniors": [
      {
        "id": "6940004926",
        "email": "B49@gmail.com",
        "name": "A49",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "387950",
        "ig": "C49",
        "photoUrl": "/images/juniors/6940004926.jpg",
        "favorites": "D49"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842068026",
    "revealed": false,
    "specialHint": "ทำงานมั่งคั่ง ราพันเซลย้อมผม บริหารความเสี่ยง",
    "hints": [
      "🦵🏻👈🏻/🐭"
    ],
    "senior": {
      "id": "6842068026",
      "email": "pichamon2169@gmail.com",
      "name": "นีร",
      "major": "ประกันภัย (INS)",
      "password": "450321"
    },
    "juniors": [
      {
        "id": "6940005026",
        "email": "B50@gmail.com",
        "name": "A50",
        "major": "ประกันภัย (INS)",
        "password": "769705",
        "ig": "C50",
        "photoUrl": "/images/juniors/6940005026.jpg",
        "favorites": "D50"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842070126",
    "revealed": false,
    "specialHint": "Are u ready?!?! พี่อยู่ไม่ใกล้ไม่ไกลจากน้องหรอกก มองให้ลึกกก👀",
    "hints": [
      "🎤🐓⭐️"
    ],
    "senior": {
      "id": "6842070126",
      "email": "poonpisit@gmail.com",
      "name": "พร้อม",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "890198"
    },
    "juniors": [
      {
        "id": "6940005126",
        "email": "B51@gmail.com",
        "name": "A51",
        "major": "ประกันภัย (INS)",
        "password": "115052",
        "ig": "C51",
        "photoUrl": "/images/juniors/6940005126.jpg",
        "favorites": "D51"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842072426",
    "revealed": false,
    "specialHint": "พี่คือสิ่งมีชีวิตที่หายใจเข้าเป็นเสียงดนตรี 🎶 หายใจออกเป็นซีรีย์เป็นมิวสิคคัล 🎭 และมีพลังชีวิตขับเคลื่อนด้วยมัจฉะ 🍵 พี่คือใคร พี่เสียงดี(มั้ง) แต่ชอบร้องเพลงมากกก",
    "hints": [
      "🎭 🎶 🍵"
    ],
    "senior": {
      "id": "6842072426",
      "email": "patwaranyafocus1618@gmail.com",
      "name": "โฟกัส",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "633346"
    },
    "juniors": [
      {
        "id": "6940005226",
        "email": "B52@gmail.com",
        "name": "A52",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "835832",
        "ig": "C52",
        "photoUrl": "/images/juniors/6940005226.jpg",
        "favorites": "D52"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842075326",
    "revealed": false,
    "specialHint": "สายตาสั้น",
    "hints": [
      "ภัทร ต้องการใบ้น้อง =🐷/🌄/🕶️"
    ],
    "senior": {
      "id": "6842075326",
      "email": "pat0959052461@gmail.com",
      "name": "ภัทร",
      "major": "ประกันภัย (INS)",
      "password": "897154"
    },
    "juniors": [
      {
        "id": "6940005326",
        "email": "B53@gmail.com",
        "name": "A53",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "416105",
        "ig": "C53",
        "photoUrl": "/images/juniors/6940005326.jpg",
        "favorites": "D53"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842077626",
    "revealed": false,
    "specialHint": "ชื่อนี้มีคนเดียวในภาค โดดเด่นเป็นตัวเอง ไม่ซ้ำใคร ใจดีเรียบร้อยพูดน้อยน่ารักทั้งหมดที่พิมพ์มาไม่มีอะไรจริงเลย หยอกเล่น",
    "hints": [
      "⬆️🏠🌏"
    ],
    "senior": {
      "id": "6842077626",
      "email": "phootibet@gmail.com",
      "name": "ทิเบต",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "722546"
    },
    "juniors": [
      {
        "id": "6940005426",
        "email": "B54@gmail.com",
        "name": "A54",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "548068",
        "ig": "C54",
        "photoUrl": "/images/juniors/6940005426.jpg",
        "favorites": "D54"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842078226",
    "revealed": false,
    "specialHint": "เพื่อนบอกว่าพี่แบดแต่พี่ว่าพี่ติ๋ม",
    "hints": [
      "🤓/😔"
    ],
    "senior": {
      "id": "6842078226",
      "email": "tonkhing.phu@gmail.com",
      "name": "ต้นขิง",
      "major": "ประกันภัย (INS)",
      "password": "710637"
    },
    "juniors": [
      {
        "id": "6940005526",
        "email": "B55@gmail.com",
        "name": "A55",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "394049",
        "ig": "C55",
        "photoUrl": "/images/juniors/6940005526.jpg",
        "favorites": "D55"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842079926",
    "revealed": false,
    "specialHint": "เด้กชายประกัน",
    "hints": [
      "😂🧑‍🏫"
    ],
    "senior": {
      "id": "6842079926",
      "email": "Bomb.phurit@gmail.com",
      "name": "บอมบ์",
      "major": "ประกันภัย (INS)",
      "password": "667794"
    },
    "juniors": [
      {
        "id": "6940005626",
        "email": "B56@gmail.com",
        "name": "A56",
        "major": "ประกันภัย (INS)",
        "password": "151096",
        "ig": "C56",
        "photoUrl": "/images/juniors/6940005626.jpg",
        "favorites": "D56"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842080426",
    "revealed": false,
    "specialHint": "พี่เอง",
    "hints": [
      "💪"
    ],
    "senior": {
      "id": "6842080426",
      "email": "popit427m@gmail.com",
      "name": "ทีน",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "974510"
    },
    "juniors": [
      {
        "id": "6940005726",
        "email": "B57@gmail.com",
        "name": "A57",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "331127",
        "ig": "C57",
        "photoUrl": "/images/juniors/6940005726.jpg",
        "favorites": "D57"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842081026",
    "revealed": false,
    "specialHint": "ไม่ใกล้ไม่ไกล ที่หนึ่งในใจ",
    "hints": [
      "🎞️/👀/🦮"
    ],
    "senior": {
      "id": "6842081026",
      "email": "manthitathonghan@gmail.com",
      "name": "แก้วตา",
      "major": "ประกันภัย (INS)",
      "password": "363246"
    },
    "juniors": [
      {
        "id": "6940005826",
        "email": "B58@gmail.com",
        "name": "A58",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "566713",
        "ig": "C58",
        "photoUrl": "/images/juniors/6940005826.jpg",
        "favorites": "D58"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842083326",
    "revealed": false,
    "specialHint": "สูง180หนัก70ผมตรงสีดำยืนทางขวา",
    "hints": [
      "🎬🐷"
    ],
    "senior": {
      "id": "6842083326",
      "email": "6842083326@student.chula.ac.th",
      "name": "โชกุน",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "875432"
    },
    "juniors": [
      {
        "id": "6940005926",
        "email": "B59@gmail.com",
        "name": "A59",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "171355",
        "ig": "C59",
        "photoUrl": "/images/juniors/6940005926.jpg",
        "favorites": "D59"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842084026",
    "revealed": false,
    "specialHint": "ชื่อสองพยางค์ ขึ้นต้น น.หนู มีหน้าม้า ผมยาว",
    "hints": [
      "🐶👧🏻💦"
    ],
    "senior": {
      "id": "6842084026",
      "email": "6842084026@student.chula.ac.th",
      "name": "น้ำใส",
      "major": "ประกันภัย (INS)",
      "password": "458902"
    },
    "juniors": [
      {
        "id": "6940006026",
        "email": "B60@gmail.com",
        "name": "A60",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "456160",
        "ig": "C60",
        "photoUrl": "/images/juniors/6940006026.jpg",
        "favorites": "D60"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842085626",
    "revealed": false,
    "specialHint": "1.ชื่อที่เฟี้ยวสุด",
    "hints": [
      "🗣/😈/🥶"
    ],
    "senior": {
      "id": "6842085626",
      "email": "lnwkla1234@gmail.com",
      "name": "ข้าวกล้า",
      "major": "ประกันภัย (INS)",
      "password": "749878"
    },
    "juniors": [
      {
        "id": "6940006126",
        "email": "B61@gmail.com",
        "name": "A61",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "630972",
        "ig": "C61",
        "photoUrl": "/images/juniors/6940006126.jpg",
        "favorites": "D61"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842087926",
    "revealed": false,
    "specialHint": "spongebob squarepants 🧽",
    "hints": [
      "💃 🎶🥟"
    ],
    "senior": {
      "id": "6842087926",
      "email": "plengrinrada15@gmail.com",
      "name": "เพลง",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "798657"
    },
    "juniors": [
      {
        "id": "6940006226",
        "email": "B62@gmail.com",
        "name": "A62",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "971581",
        "ig": "C62",
        "photoUrl": "/images/juniors/6940006226.jpg",
        "favorites": "D62"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842088526",
    "revealed": false,
    "specialHint": "Q = A x V",
    "hints": [
      "🧏🏻‍♀️🏝️🌊"
    ],
    "senior": {
      "id": "6842088526",
      "email": "sainam743s@gmail.com",
      "name": "สายน้ำ",
      "major": "ประกันภัย (INS)",
      "password": "739975"
    },
    "juniors": [
      {
        "id": "6940006326",
        "email": "B63@gmail.com",
        "name": "A63",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "706637",
        "ig": "C63",
        "photoUrl": "/images/juniors/6940006326.jpg",
        "favorites": "D63"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842089126",
    "revealed": false,
    "specialHint": "ถ้าเลือกได้ น้องจะไม่อยากเจอพี่",
    "hints": [
      "🎮🛏️🎵"
    ],
    "senior": {
      "id": "6842089126",
      "email": "Paulwachirawish@gmail.com",
      "name": "พอล",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "881385"
    },
    "juniors": [
      {
        "id": "6940006426",
        "email": "B64@gmail.com",
        "name": "A64",
        "major": "ประกันภัย (INS)",
        "password": "682474",
        "ig": "C64",
        "photoUrl": "/images/juniors/6940006426.jpg",
        "favorites": "D64"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842092026",
    "revealed": false,
    "specialHint": "ฟพหแกนาโญสวณเ่ำยสมวงบาหย์ศหบยไยไวมแีำนยำ",
    "hints": [
      "🙇🏻‍♀️/🥒/🎀"
    ],
    "senior": {
      "id": "6842092026",
      "email": "waranya.phiokliang@gmail.com",
      "name": "โม",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "887258"
    },
    "juniors": [
      {
        "id": "6940006526",
        "email": "B65@gmail.com",
        "name": "A65",
        "major": "ประกันภัย (INS)",
        "password": "590925",
        "ig": "C65",
        "photoUrl": "/images/juniors/6940006526.jpg",
        "favorites": "D65"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842093626",
    "revealed": false,
    "specialHint": "พี่เป็นหมาป่าเดียวดาย บรู้วววว",
    "hints": [
      "🐘 🐓 🥱"
    ],
    "senior": {
      "id": "6842093626",
      "email": "ngaungwarat@gmail.com",
      "name": "ง้วง",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "357471"
    },
    "juniors": [
      {
        "id": "6940006626",
        "email": "B66@gmail.com",
        "name": "A66",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "488433",
        "ig": "C66",
        "photoUrl": "/images/juniors/6940006626.jpg",
        "favorites": "D66"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842094226",
    "revealed": false,
    "specialHint": "สูงกว่าค่าเฉลี่ยนิดนึง…นิดเดียวเอง",
    "hints": [
      "😑😴🤐"
    ],
    "senior": {
      "id": "6842094226",
      "email": "nondg1006@gmail.com",
      "name": "นนท์",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "832646"
    },
    "juniors": [
      {
        "id": "6940006726",
        "email": "B67@gmail.com",
        "name": "A67",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "129232",
        "ig": "C67",
        "photoUrl": "/images/juniors/6940006726.jpg",
        "favorites": "D67"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842095926",
    "revealed": false,
    "specialHint": "จันทราสาดแสงส่องสู่สายชล เภตราร่องรอยในธารา",
    "hints": [
      "🪄 🐍 🧙🏻"
    ],
    "senior": {
      "id": "6842095926",
      "email": "wattanawadee.wong2549@gmail.com",
      "name": "ลิลลี่",
      "major": "ประกันภัย (INS)",
      "password": "791000"
    },
    "juniors": [
      {
        "id": "6940006826",
        "email": "B68@gmail.com",
        "name": "A68",
        "major": "ประกันภัย (INS)",
        "password": "599278",
        "ig": "C68",
        "photoUrl": "/images/juniors/6940006826.jpg",
        "favorites": "D68"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842096526",
    "revealed": false,
    "specialHint": "- ไม่ได้เป็นสตาฟ - ดัดฟัน - ไม่ได้ใส่แว่น -☝️☝️☝️😁😁😁",
    "hints": [
      "🤓🍭👈"
    ],
    "senior": {
      "id": "6842096526",
      "email": "Witchakorn9494@gmail.com",
      "name": "พ้อยท์",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "216718"
    },
    "juniors": [
      {
        "id": "6940006926",
        "email": "B69@gmail.com",
        "name": "A69",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "393265",
        "ig": "C69",
        "photoUrl": "/images/juniors/6940006926.jpg",
        "favorites": "D69"
      },
      {
        "id": "6940008626",
        "email": "B86@gmail.com",
        "name": "A86",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "912560",
        "ig": "C86",
        "photoUrl": "/images/juniors/6940008626.jpg",
        "favorites": "D86"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842101026",
    "revealed": false,
    "specialHint": "สูง 164 ตัวเล็กอยู่ ไม่ใส่แว่น ไม่ใช่สตาฟ",
    "hints": [
      "🧪🧑‍🔬3️⃣"
    ],
    "senior": {
      "id": "6842101026",
      "email": "supphawit2006@gmail.com",
      "name": "วิท",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "779024"
    },
    "juniors": [
      {
        "id": "6940007026",
        "email": "B70@gmail.com",
        "name": "A70",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "704682",
        "ig": "C70",
        "photoUrl": "/images/juniors/6940007026.jpg",
        "favorites": "D70"
      },
      {
        "id": "6940008726",
        "email": "B87@gmail.com",
        "name": "A87",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "585210",
        "ig": "C87",
        "photoUrl": "/images/juniors/6940008726.jpg",
        "favorites": "D87"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842102626",
    "revealed": false,
    "specialHint": "ชื่อพรี่ขึ้นต้นด้วย จ. ฮุฮุ พี่เป็นผู้ชาย เอ๊ะ พี่เป็นสไลม์ เอ๊ะ พี่ผมยาวๆ เอ๊ะ ไม่ใบ้ล่ะอิอิ",
    "hints": [
      "🙆‍♂️/🍽️/💙"
    ],
    "senior": {
      "id": "6842102626",
      "email": "Jeffy150307@gmail.com",
      "name": "เจฟฟี่",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "230497"
    },
    "juniors": [
      {
        "id": "6940007126",
        "email": "B71@gmail.com",
        "name": "A71",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "545800",
        "ig": "C71",
        "photoUrl": "/images/juniors/6940007126.jpg",
        "favorites": "D71"
      },
      {
        "id": "6940008826",
        "email": "B88@gmail.com",
        "name": "A88",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "600502",
        "ig": "C88",
        "photoUrl": "/images/juniors/6940008826.jpg",
        "favorites": "D88"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842104926",
    "revealed": false,
    "specialHint": "สาวBIT อินโทรเวิดหาตัวยากกกก ตาดำเหมือนไม่ได้นอน สูงน้อยกว่าหมีเนย21เซน",
    "hints": [
      "👩‍🍳🐮💜"
    ],
    "senior": {
      "id": "6842104926",
      "email": "Sarisahan07@gmail.com",
      "name": "นานา",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "451548"
    },
    "juniors": [
      {
        "id": "6940007226",
        "email": "B72@gmail.com",
        "name": "A72",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "453327",
        "ig": "C72",
        "photoUrl": "/images/juniors/6940007226.jpg",
        "favorites": "D72"
      },
      {
        "id": "6940008926",
        "email": "B89@gmail.com",
        "name": "A89",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "331034",
        "ig": "C89",
        "photoUrl": "/images/juniors/6940008926.jpg",
        "favorites": "D89"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842105526",
    "revealed": false,
    "specialHint": "นั่นธงน้ำเงิน โบกพลิ้ว ปลิวสะบัด ---> น้ำใจน้องพี่สีชมพู ทุกคนไม่รู้ลืมบูชา",
    "hints": [
      "😎🗡️👍"
    ],
    "senior": {
      "id": "6842105526",
      "email": "siraphob.dd@gmail.com",
      "name": "ดีดี",
      "major": "ประกันภัย (INS)",
      "password": "263705"
    },
    "juniors": [
      {
        "id": "6940007326",
        "email": "B73@gmail.com",
        "name": "A73",
        "major": "ประกันภัย (INS)",
        "password": "578707",
        "ig": "C73",
        "photoUrl": "/images/juniors/6940007326.jpg",
        "favorites": "D73"
      },
      {
        "id": "6940009026",
        "email": "B90@gmail.com",
        "name": "A90",
        "major": "ประกันภัย (INS)",
        "password": "186479",
        "ig": "C90",
        "photoUrl": "/images/juniors/6940009026.jpg",
        "favorites": "D90"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842106126",
    "revealed": false,
    "specialHint": "เพลงดังเติ้งลี่จวิน",
    "hints": [
      "🐄/🐎/🥚"
    ],
    "senior": {
      "id": "6842106126",
      "email": "6842106126@student.chula.ac.th",
      "name": "มีมี่",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "750677"
    },
    "juniors": [
      {
        "id": "6940007426",
        "email": "B74@gmail.com",
        "name": "A74",
        "major": "ประกันภัย (INS)",
        "password": "533349",
        "ig": "C74",
        "photoUrl": "/images/juniors/6940007426.jpg",
        "favorites": "D74"
      },
      {
        "id": "6940009126",
        "email": "B91@gmail.com",
        "name": "A91",
        "major": "ประกันภัย (INS)",
        "password": "503959",
        "ig": "C91",
        "photoUrl": "/images/juniors/6940009126.jpg",
        "favorites": "D91"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842110626",
    "revealed": false,
    "specialHint": "โสด",
    "hints": [
      "😏/🧈/🍳"
    ],
    "senior": {
      "id": "6842110626",
      "email": "hataiwanwong@gmail.com",
      "name": "แพนเค้ก",
      "major": "ประกันภัย (INS)",
      "password": "644569"
    },
    "juniors": [
      {
        "id": "6940007526",
        "email": "B75@gmail.com",
        "name": "A75",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "465290",
        "ig": "C75",
        "photoUrl": "/images/juniors/6940007526.jpg",
        "favorites": "D75"
      },
      {
        "id": "6940009226",
        "email": "B92@gmail.com",
        "name": "A92",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "870588",
        "ig": "C92",
        "photoUrl": "/images/juniors/6940009226.jpg",
        "favorites": "D92"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842111226",
    "revealed": false,
    "specialHint": "พี่ตัวสูง ผู้หญิงประดิษฐ์ ผู้ชายแต่งกายคล้ายหญิง มัดผม ใส่แว่น เอออไม่ต้องพูดเยอะ จบนี่ไปกินบุฟเฟ่ต์เดี๋ยวพี่เลี้ยง",
    "hints": [
      "🌾🛁🐢"
    ],
    "senior": {
      "id": "6842111226",
      "email": "adichula109@gmail.com",
      "name": "ข้าวโอ๊ต",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "909461"
    },
    "juniors": [
      {
        "id": "6940007626",
        "email": "B76@gmail.com",
        "name": "A76",
        "major": "ประกันภัย (INS)",
        "password": "617555",
        "ig": "C76",
        "photoUrl": "/images/juniors/6940007626.jpg",
        "favorites": "D76"
      },
      {
        "id": "6940009326",
        "email": "B93@gmail.com",
        "name": "A93",
        "major": "ประกันภัย (INS)",
        "password": "190613",
        "ig": "C93",
        "photoUrl": "/images/juniors/6940009326.jpg",
        "favorites": "D93"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842112926",
    "revealed": false,
    "specialHint": "พี่ผมสั้นแต่ก็ไม่สั้นมาก เป็นผู้หญังหรืแเปล่านร้า อิอิ",
    "hints": [
      "🩵🪽🍜"
    ],
    "senior": {
      "id": "6842112926",
      "email": "taihog8@gmail.com",
      "name": "ชมพู่",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "172484"
    },
    "juniors": [
      {
        "id": "6940007726",
        "email": "B77@gmail.com",
        "name": "A77",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "579748",
        "ig": "C77",
        "photoUrl": "/images/juniors/6940007726.jpg",
        "favorites": "D77"
      },
      {
        "id": "6940009426",
        "email": "B94@gmail.com",
        "name": "A94",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "761874",
        "ig": "C94",
        "photoUrl": "/images/juniors/6940009426.jpg",
        "favorites": "D94"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842114126",
    "revealed": false,
    "specialHint": "ตี๋ไปโน้นไป",
    "hints": [
      "⚽️🤓😴"
    ],
    "senior": {
      "id": "6842114126",
      "email": "innenman11@gmail.com",
      "name": "อินน์",
      "major": "ประกันภัย (INS)",
      "password": "424429"
    },
    "juniors": [
      {
        "id": "6940007826",
        "email": "B78@gmail.com",
        "name": "A78",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "303020",
        "ig": "C78",
        "photoUrl": "/images/juniors/6940007826.jpg",
        "favorites": "D78"
      },
      {
        "id": "6940009526",
        "email": "B95@gmail.com",
        "name": "A95",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "923187",
        "ig": "C95",
        "photoUrl": "/images/juniors/6940009526.jpg",
        "favorites": "D95"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842116426",
    "revealed": false,
    "specialHint": "เป็นลูกคนเล็ก ชอบนอน สั่งเดลิเวอรี่อ้วน ๆ ขำกลิ้งลิงกับหมา ยินดีต้อนรับเข้าสู่ stat นะ เป็นคนร่าเริง พ่อไก่อารมณ์ดี พี่เป็นหนึ่งในผู้จัดทำ STAT DAY ตัวละครลับ #พิกัดลับสแตทเดย์ เอาไว้ถ้าพี่เห็นว่าน้องหาพี่ไม่เจอจริง ๆ พี่จะใบ้เพิ่มนะ",
    "hints": [
      "🛁🎠🫰🏻"
    ],
    "senior": {
      "id": "6842116426",
      "email": "aimatcharapan@gmail.com",
      "name": "อิมมี่",
      "major": "ประกันภัย (INS)",
      "password": "120466"
    },
    "juniors": [
      {
        "id": "6940007926",
        "email": "B79@gmail.com",
        "name": "A79",
        "major": "ประกันภัย (INS)",
        "password": "880902",
        "ig": "C79",
        "photoUrl": "/images/juniors/6940007926.jpg",
        "favorites": "D79"
      },
      {
        "id": "6940009626",
        "email": "B96@gmail.com",
        "name": "A96",
        "major": "ประกันภัย (INS)",
        "password": "779414",
        "ig": "C96",
        "photoUrl": "/images/juniors/6940009626.jpg",
        "favorites": "D96"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842117026",
    "revealed": false,
    "specialHint": "พี่ตัวใหญ่มาก ขอแอบแปร้บ ิิ",
    "hints": [
      "🅿️/🫰🏻/😘"
    ],
    "senior": {
      "id": "6842117026",
      "email": "aunyigaaun8009@gmail.com",
      "name": "อัญ",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "719283"
    },
    "juniors": [
      {
        "id": "6940008026",
        "email": "B80@gmail.com",
        "name": "A80",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "703956",
        "ig": "C80",
        "photoUrl": "/images/juniors/6940008026.jpg",
        "favorites": "D80"
      },
      {
        "id": "6940009726",
        "email": "B97@gmail.com",
        "name": "A97",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "850456",
        "ig": "C97",
        "photoUrl": "/images/juniors/6940009726.jpg",
        "favorites": "D97"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842118726",
    "revealed": false,
    "specialHint": "ผลิตภัณฑ์จากนมซึ่งสามารถผลิตได้จากนมวัวหรือแพะ เป็นต้น ที่ผ่านกระบวนการคัดแยกโปรตีน แล้วนำโปรตีนของนมมาทำการผสมเชื้อรา หรือแบคทีเรีย หรือสารอื่น ๆ แตกต่างกันไปตามแต่ละประเภทของเนยแข็ง ซึ่งแตกต่างจากเนยที่ทำมาจากไขมันของนม",
    "hints": [
      "🍅/🍕/🍝"
    ],
    "senior": {
      "id": "6842118726",
      "email": "akirapiya1@gmail.com",
      "name": "ชีส",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "989378"
    },
    "juniors": [
      {
        "id": "6940008126",
        "email": "B81@gmail.com",
        "name": "A81",
        "major": "ประกันภัย (INS)",
        "password": "853307",
        "ig": "C81",
        "photoUrl": "/images/juniors/6940008126.jpg",
        "favorites": "D81"
      },
      {
        "id": "6940009826",
        "email": "B98@gmail.com",
        "name": "A98",
        "major": "ประกันภัย (INS)",
        "password": "340756",
        "ig": "C98",
        "photoUrl": "/images/juniors/6940009826.jpg",
        "favorites": "D98"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842119326",
    "revealed": false,
    "specialHint": "เงินเดือนออก เหมือนถูกหวย รวยชั่วครู่ แป๊บเดียวดู อ้าวเฮ้ย หายไปไหน อ๋อ...เมื่อคืน กดเอฟของ จนเพลินใจ เช้าตื่นมา น้ำตาไหล ร้องไห้โฮ “ม”",
    "hints": [
      "🐜🐎🐈"
    ],
    "senior": {
      "id": "6842119326",
      "email": "mix.araya.2549@gmail.com",
      "name": "มิก",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "256221"
    },
    "juniors": [
      {
        "id": "6940008226",
        "email": "B82@gmail.com",
        "name": "A82",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "193436",
        "ig": "C82",
        "photoUrl": "/images/juniors/6940008226.jpg",
        "favorites": "D82"
      },
      {
        "id": "6940009926",
        "email": "B99@gmail.com",
        "name": "A99",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "610520",
        "ig": "C99",
        "photoUrl": "/images/juniors/6940009926.jpg",
        "favorites": "D99"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842120926",
    "revealed": false,
    "specialHint": "พี่ชอบสีชมพู แต่คนอื่นก็ชอบสีชมพูเหมือนกัน พี่ผมยาวอยู่นะถ้าเทียบกับอิคคิวซัง5555 น้องรู้ไหมว่าไหอะไรสีแดง (ตอบ ใหจัว หัวใจ❤️) พี่ไม่ได้ extrovert มาก น้องหาพี่ไม่เจอหรอก ิิ คำใบ้ : สีชมพู กวนๆ ",
    "hints": [
      "🅰️⌨️🚌"
    ],
    "senior": {
      "id": "6842120926",
      "email": "hansaissada0@gmail.com",
      "name": "แอมเม่",
      "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
      "password": "315720"
    },
    "juniors": [
      {
        "id": "6940008326",
        "email": "B83@gmail.com",
        "name": "A83",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "104365",
        "ig": "C83",
        "photoUrl": "/images/juniors/6940008326.jpg",
        "favorites": "D83"
      },
      {
        "id": "6940010026",
        "email": "B100@gmail.com",
        "name": "A100",
        "major": "เทคโนโลยีสารสนเทศเพื่อธุรกิจ (BIT)",
        "password": "188137",
        "ig": "C100",
        "photoUrl": "/images/juniors/6940010026.jpg",
        "favorites": "D100"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842121526",
    "revealed": false,
    "specialHint": "ท่ามกลางงานสแตทเดย์ที่เฉิดฉาย มีกลุ่มพริ้วเลื้อยลายไม่เกรงขาม พี่คือหนึ่งในกลุ่มที่ติดตาม ผ่านนิยามตัวเลขและข้อมูล ในพิกัดที่ลับตาชาวติ๊กต็อก ชื่อกลุ่มบอกตัวตนที่หนุนส่ง หวดไม้แร็กเกตตีกระทบลง ในสนามเทนนิสคงได้พบกัน บนเวทีเปิดฟ้าที่ไฟส่อง พี่เต้นสันสนั่นก้องไม่แปรผัน จังหวะโหดที่น้องเห็นในทุกวัน คือตัวตนของพี่นั้น... รอให้ทาย",
    "hints": [
      "🍵/🕺🏻/🎾"
    ],
    "senior": {
      "id": "6842121526",
      "email": "amysethabutra@gmail.com",
      "name": "เอมี่",
      "major": "สถิติและวิทยาการข้อมูล (STAT)",
      "password": "447666"
    },
    "juniors": [
      {
        "id": "6940008426",
        "email": "B84@gmail.com",
        "name": "A84",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "683470",
        "ig": "C84",
        "photoUrl": "/images/juniors/6940008426.jpg",
        "favorites": "D84"
      },
      {
        "id": "6940010126",
        "email": "B101@gmail.com",
        "name": "A101",
        "major": "สถิติและวิทยาการข้อมูล (STAT)",
        "password": "957360",
        "ig": "C101",
        "photoUrl": "/images/juniors/6940010126.jpg",
        "favorites": "D101"
      }
    ],
    "messages": []
  },
  {
    "id": "lineage-6842122126",
    "revealed": false,
    "specialHint": "วันนี้พี่ยิ้มเยอะ",
    "hints": [
      "🐣🎄🫂"
    ],
    "senior": {
      "id": "6842122126",
      "email": "yyorchwp@gmail.com",
      "name": "ยอร์ช",
      "major": "ประกันภัย (INS)",
      "password": "903010"
    },
    "juniors": [
      {
        "id": "6940008526",
        "email": "B85@gmail.com",
        "name": "A85",
        "major": "ประกันภัย (INS)",
        "password": "302972",
        "ig": "C85",
        "photoUrl": "/images/juniors/6940008526.jpg",
        "favorites": "D85"
      },
      {
        "id": "6940010226",
        "email": "B102@gmail.com",
        "name": "A102",
        "major": "ประกันภัย (INS)",
        "password": "714983",
        "ig": "C102",
        "photoUrl": "/images/juniors/6940010226.jpg",
        "favorites": "D102"
      }
    ],
    "messages": []
  }
];

const INITIAL_BUDDIES = [
  {
    "id": "buddy-001",
    "seniorId": "6842002526",
    "juniorId": "6940010226"
  },
  {
    "id": "buddy-002",
    "seniorId": "6842003126",
    "juniorId": "6940010126"
  },
  {
    "id": "buddy-003",
    "seniorId": "6842006026",
    "juniorId": "6940010026"
  },
  {
    "id": "buddy-004",
    "seniorId": "6842007726",
    "juniorId": "6940009926"
  },
  {
    "id": "buddy-005",
    "seniorId": "6842008326",
    "juniorId": "6940009826"
  },
  {
    "id": "buddy-006",
    "seniorId": "6842009026",
    "juniorId": "6940009726"
  },
  {
    "id": "buddy-007",
    "seniorId": "6842011126",
    "juniorId": "6940009626"
  },
  {
    "id": "buddy-008",
    "seniorId": "6842013426",
    "juniorId": "6940009526"
  },
  {
    "id": "buddy-009",
    "seniorId": "6842014026",
    "juniorId": "6940009426"
  },
  {
    "id": "buddy-010",
    "seniorId": "6842015726",
    "juniorId": "6940009326"
  },
  {
    "id": "buddy-011",
    "seniorId": "6842016326",
    "juniorId": "6940009226"
  },
  {
    "id": "buddy-012",
    "seniorId": "6842017026",
    "juniorId": "6940009126"
  },
  {
    "id": "buddy-013",
    "seniorId": "6842019226",
    "juniorId": "6940009026"
  },
  {
    "id": "buddy-014",
    "seniorId": "6842020826",
    "juniorId": "6940008926"
  },
  {
    "id": "buddy-015",
    "seniorId": "6842021426",
    "juniorId": "6940008826"
  },
  {
    "id": "buddy-016",
    "seniorId": "6842022026",
    "juniorId": "6940008726"
  },
  {
    "id": "buddy-017",
    "seniorId": "6842023726",
    "juniorId": "6940008626"
  },
  {
    "id": "buddy-018",
    "seniorId": "6842024326",
    "juniorId": "6940008526"
  },
  {
    "id": "buddy-019",
    "seniorId": "6842025026",
    "juniorId": "6940008426"
  },
  {
    "id": "buddy-020",
    "seniorId": "6842026626",
    "juniorId": "6940008326"
  },
  {
    "id": "buddy-021",
    "seniorId": "6842027226",
    "juniorId": "6940008226"
  },
  {
    "id": "buddy-022",
    "seniorId": "6842028926",
    "juniorId": "6940008126"
  },
  {
    "id": "buddy-023",
    "seniorId": "6842029526",
    "juniorId": "6940008026"
  },
  {
    "id": "buddy-024",
    "seniorId": "6842032326",
    "juniorId": "6940007926"
  },
  {
    "id": "buddy-025",
    "seniorId": "6842034626",
    "juniorId": "6940007826"
  },
  {
    "id": "buddy-026",
    "seniorId": "6842035226",
    "juniorId": "6940007726"
  },
  {
    "id": "buddy-027",
    "seniorId": "6842036926",
    "juniorId": "6940007626"
  },
  {
    "id": "buddy-028",
    "seniorId": "6842037526",
    "juniorId": "6940007526"
  },
  {
    "id": "buddy-029",
    "seniorId": "6842040326",
    "juniorId": "6940007426"
  },
  {
    "id": "buddy-030",
    "seniorId": "6842041026",
    "juniorId": "6940007326"
  },
  {
    "id": "buddy-031",
    "seniorId": "6842042626",
    "juniorId": "6940007226"
  },
  {
    "id": "buddy-032",
    "seniorId": "6842043226",
    "juniorId": "6940007126"
  },
  {
    "id": "buddy-033",
    "seniorId": "6842045526",
    "juniorId": "6940007026"
  },
  {
    "id": "buddy-034",
    "seniorId": "6842047826",
    "juniorId": "6940006926"
  },
  {
    "id": "buddy-035",
    "seniorId": "6842049026",
    "juniorId": "6940006826"
  },
  {
    "id": "buddy-036",
    "seniorId": "6842050626",
    "juniorId": "6940006726"
  },
  {
    "id": "buddy-037",
    "seniorId": "6842051226",
    "juniorId": "6940006626"
  },
  {
    "id": "buddy-038",
    "seniorId": "6842052926",
    "juniorId": "6940006526"
  },
  {
    "id": "buddy-039",
    "seniorId": "6842053526",
    "juniorId": "6940006426"
  },
  {
    "id": "buddy-040",
    "seniorId": "6842054126",
    "juniorId": "6940006326"
  },
  {
    "id": "buddy-041",
    "seniorId": "6842055826",
    "juniorId": "6940006226"
  },
  {
    "id": "buddy-042",
    "seniorId": "6842056426",
    "juniorId": "6940006126"
  },
  {
    "id": "buddy-043",
    "seniorId": "6842058726",
    "juniorId": "6940006026"
  },
  {
    "id": "buddy-044",
    "seniorId": "6842059326",
    "juniorId": "6940005926"
  },
  {
    "id": "buddy-045",
    "seniorId": "6842061526",
    "juniorId": "6940005826"
  },
  {
    "id": "buddy-046",
    "seniorId": "6842062126",
    "juniorId": "6940005726"
  },
  {
    "id": "buddy-047",
    "seniorId": "6842064426",
    "juniorId": "6940005626"
  },
  {
    "id": "buddy-048",
    "seniorId": "6842066726",
    "juniorId": "6940005526"
  },
  {
    "id": "buddy-049",
    "seniorId": "6842067326",
    "juniorId": "6940005426"
  },
  {
    "id": "buddy-050",
    "seniorId": "6842068026",
    "juniorId": "6940005326"
  },
  {
    "id": "buddy-051",
    "seniorId": "6842070126",
    "juniorId": "6940005226"
  },
  {
    "id": "buddy-052",
    "seniorId": "6842072426",
    "juniorId": "6940005126"
  },
  {
    "id": "buddy-053",
    "seniorId": "6842075326",
    "juniorId": "6940005026"
  },
  {
    "id": "buddy-054",
    "seniorId": "6842077626",
    "juniorId": "6940004926"
  },
  {
    "id": "buddy-055",
    "seniorId": "6842078226",
    "juniorId": "6940004826"
  },
  {
    "id": "buddy-056",
    "seniorId": "6842079926",
    "juniorId": "6940004726"
  },
  {
    "id": "buddy-057",
    "seniorId": "6842080426",
    "juniorId": "6940004626"
  },
  {
    "id": "buddy-058",
    "seniorId": "6842081026",
    "juniorId": "6940004526"
  },
  {
    "id": "buddy-059",
    "seniorId": "6842083326",
    "juniorId": "6940004426"
  },
  {
    "id": "buddy-060",
    "seniorId": "6842084026",
    "juniorId": "6940004326"
  },
  {
    "id": "buddy-061",
    "seniorId": "6842085626",
    "juniorId": "6940004226"
  },
  {
    "id": "buddy-062",
    "seniorId": "6842087926",
    "juniorId": "6940004126"
  },
  {
    "id": "buddy-063",
    "seniorId": "6842088526",
    "juniorId": "6940004026"
  },
  {
    "id": "buddy-064",
    "seniorId": "6842089126",
    "juniorId": "6940003926"
  },
  {
    "id": "buddy-065",
    "seniorId": "6842092026",
    "juniorId": "6940003826"
  },
  {
    "id": "buddy-066",
    "seniorId": "6842093626",
    "juniorId": "6940003726"
  },
  {
    "id": "buddy-067",
    "seniorId": "6842094226",
    "juniorId": "6940003626"
  },
  {
    "id": "buddy-068",
    "seniorId": "6842095926",
    "juniorId": "6940003526"
  },
  {
    "id": "buddy-069",
    "seniorId": "6842096526",
    "juniorId": "6940003426"
  },
  {
    "id": "buddy-070",
    "seniorId": "6842101026",
    "juniorId": "6940003326"
  },
  {
    "id": "buddy-071",
    "seniorId": "6842102626",
    "juniorId": "6940003226"
  },
  {
    "id": "buddy-072",
    "seniorId": "6842104926",
    "juniorId": "6940003126"
  },
  {
    "id": "buddy-073",
    "seniorId": "6842105526",
    "juniorId": "6940003026"
  },
  {
    "id": "buddy-074",
    "seniorId": "6842106126",
    "juniorId": "6940002926"
  },
  {
    "id": "buddy-075",
    "seniorId": "6842110626",
    "juniorId": "6940002826"
  },
  {
    "id": "buddy-076",
    "seniorId": "6842111226",
    "juniorId": "6940002726"
  },
  {
    "id": "buddy-077",
    "seniorId": "6842112926",
    "juniorId": "6940002626"
  },
  {
    "id": "buddy-078",
    "seniorId": "6842114126",
    "juniorId": "6940002526"
  },
  {
    "id": "buddy-079",
    "seniorId": "6842116426",
    "juniorId": "6940002426"
  },
  {
    "id": "buddy-080",
    "seniorId": "6842117026",
    "juniorId": "6940002326"
  },
  {
    "id": "buddy-081",
    "seniorId": "6842118726",
    "juniorId": "6940002226"
  },
  {
    "id": "buddy-082",
    "seniorId": "6842119326",
    "juniorId": "6940002126"
  },
  {
    "id": "buddy-083",
    "seniorId": "6842120926",
    "juniorId": "6940002026"
  },
  {
    "id": "buddy-084",
    "seniorId": "6842121526",
    "juniorId": "6940001926"
  },
  {
    "id": "buddy-085",
    "seniorId": "6842122126",
    "juniorId": "6940001826"
  },
  {
    "id": "buddy-086",
    "seniorId": "6842096526",
    "juniorId": "6940001726"
  },
  {
    "id": "buddy-087",
    "seniorId": "6842101026",
    "juniorId": "6940001626"
  },
  {
    "id": "buddy-088",
    "seniorId": "6842102626",
    "juniorId": "6940001526"
  },
  {
    "id": "buddy-089",
    "seniorId": "6842104926",
    "juniorId": "6940001426"
  },
  {
    "id": "buddy-090",
    "seniorId": "6842105526",
    "juniorId": "6940001326"
  },
  {
    "id": "buddy-091",
    "seniorId": "6842106126",
    "juniorId": "6940001226"
  },
  {
    "id": "buddy-092",
    "seniorId": "6842110626",
    "juniorId": "6940001126"
  },
  {
    "id": "buddy-093",
    "seniorId": "6842111226",
    "juniorId": "6940001026"
  },
  {
    "id": "buddy-094",
    "seniorId": "6842112926",
    "juniorId": "6940000926"
  },
  {
    "id": "buddy-095",
    "seniorId": "6842114126",
    "juniorId": "6940000826"
  },
  {
    "id": "buddy-096",
    "seniorId": "6842116426",
    "juniorId": "6940000726"
  },
  {
    "id": "buddy-097",
    "seniorId": "6842117026",
    "juniorId": "6940000626"
  },
  {
    "id": "buddy-098",
    "seniorId": "6842118726",
    "juniorId": "6940000526"
  },
  {
    "id": "buddy-099",
    "seniorId": "6842119326",
    "juniorId": "6940000426"
  },
  {
    "id": "buddy-100",
    "seniorId": "6842120926",
    "juniorId": "6940000326"
  },
  {
    "id": "buddy-101",
    "seniorId": "6842121526",
    "juniorId": "6940000226"
  },
  {
    "id": "buddy-102",
    "seniorId": "6842122126",
    "juniorId": "6940000126"
  }
];

function getLineages() {
  const localData = localStorage.getItem("stat_lineage_data");
  if (!localData) {
    localStorage.setItem("stat_lineage_data", JSON.stringify(INITIAL_LINEAGES));
    return INITIAL_LINEAGES;
  }
  try {
    const data = JSON.parse(localData);
    
    // ตรวจสอบและอัปเกรดข้อมูล (Migration) หากขาดฟิลด์คำใบ้พิเศษ หรือต้องการอัปเดตอีเมลสำหรับการทดสอบ
    let updated = false;
    data.forEach((lin) => {
      const initial = INITIAL_LINEAGES.find(i => i.id === lin.id);
      if (initial) {
        // อัปเกรดฟิลด์ specialHint หากยังไม่มีใน localStorage
        if (!lin.hasOwnProperty('specialHint')) {
          lin.specialHint = initial.specialHint;
          updated = true;
        }
        // อัปเดตอีเมลพี่รหัสเผื่อกรณีใช้ข้อมูลเก่าอยู่
        if (lin.senior.email !== initial.senior.email) {
          lin.senior.email = initial.senior.email;
          updated = true;
        }
        // อัปเดตอีเมลน้องรหัส
        lin.juniors.forEach((jun, jIdx) => {
          const initJun = initial.juniors[jIdx];
          if (initJun && jun.email !== initJun.email) {
            jun.email = initJun.email;
            updated = true;
          }
        });
      }
    });
    
    if (updated) {
      localStorage.setItem("stat_lineage_data", JSON.stringify(data));
    }
    
    return data;
  } catch (e) {
    console.error("Error parsing lineage data, resetting to initial", e);
    localStorage.setItem("stat_lineage_data", JSON.stringify(INITIAL_LINEAGES));
    return INITIAL_LINEAGES;
  }
}

// ฟังก์ชันสำหรับบันทึกข้อมูลสายรหัสทั้งหมดลง localStorage
function saveLineages(lineages) {
  localStorage.setItem("stat_lineage_data", JSON.stringify(lineages));
}

// ฟังก์ชันดึงคอนฟิกของระบบทายและคำใบ้พิเศษ
function getGlobalConfig() {
  const config = localStorage.getItem("stat_lineage_config");
  if (!config) {
    const initialConfig = {
      specialHintsRevealed: false,
      guessingEnabled: false
    };
    localStorage.setItem("stat_lineage_config", JSON.stringify(initialConfig));
    return initialConfig;
  }
  try {
    return JSON.parse(config);
  } catch (e) {
    const initialConfig = {
      specialHintsRevealed: false,
      guessingEnabled: false
    };
    localStorage.setItem("stat_lineage_config", JSON.stringify(initialConfig));
    return initialConfig;
  }
}

// ฟังก์ชันเซฟคอนฟิกของระบบทายและคำใบ้พิเศษ
function saveGlobalConfig(config) {
  localStorage.setItem("stat_lineage_config", JSON.stringify(config));
}

// ==========================================
// CLOUDFLARE SERVER API SYNC LOGIC
// ==========================================

// ฟังก์ชันซิงค์ข้อมูลกับ Server Cloudflare Backend
async function syncWithServer() {
  try {
    // 1. ซิงค์ค่าสายรหัสทั้งหมด
    const reqUserId = window.currentSession?.user?.id || '';
    const reqRole = window.currentSession?.role || '';
    const resLineages = await fetch(`/api/lineages?userId=${reqUserId}&role=${reqRole}`);
    if (resLineages.ok) {
      const lineages = await resLineages.json();
      localStorage.setItem("stat_lineage_data", JSON.stringify(lineages));
    }
    
    // 2. ซิงค์ค่าคอนฟิกระบบวันงาน
    const resConfig = await fetch("/api/config");
    if (resConfig.ok) {
      const config = await resConfig.json();
      localStorage.setItem("stat_lineage_config", JSON.stringify(config));
    }
  } catch (err) {
    console.warn("Unable to sync with Cloudflare Server (running offline mode?):", err);
  }
}

// ฟังก์ชันตรวจสอบสิทธิ์การ Login
// คืนค่า { role: 'junior'|'senior', user: UserObject, lineage: LineageObject }
async function checkLogin(role, email, password) {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, email, password })
    });
    
    if (res.ok) {
      const data = await res.json();
      // อัปเดตข้อมูล cache ในเบราว์เซอร์ทันที
      await syncWithServer();
      return data;
    }
  } catch (err) {
    console.error("Login API request failed, falling back to local database:", err);
  }
  
  // fallback ในกรณีออฟไลน์หรือยังไม่ดีพลอย
  const lineages = getLineages();
  const cleanEmail = email.trim().toLowerCase();
  const cleanId = password.trim();

  for (const lin of lineages) {
    if (role === "senior") {
      if (lin.senior.password === cleanId && lin.senior.email.toLowerCase() === cleanEmail) {
        return {
          role: "senior",
          user: lin.senior,
          lineage: lin
        };
      }
    } else if (role === "junior") {
      const junior = lin.juniors.find(
        j => j.password === cleanId && j.email.toLowerCase() === cleanEmail
      );
      if (junior) {
        return {
          role: "junior",
          user: junior,
          lineage: lin
        };
      }
    }
  }
  return null;
}

// ฟังก์ชันล้างข้อมูลกลับไปเป็นค่าเริ่มต้นและรีเซ็ต D1 บน Cloudflare
async function resetDatabase() {
  try {
    await fetch("/api/reset", { method: "POST" });
  } catch (err) {
    console.error("API reset failed:", err);
  }
  
  localStorage.setItem("stat_lineage_data", JSON.stringify(INITIAL_LINEAGES));
  localStorage.removeItem("stat_lineage_config");
  sessionStorage.removeItem("stat_session");
  location.reload();
}

// API ยิงส่งข้อความแชทไปเซิร์ฟเวอร์
async function apiSendMessage(lineageId, senderId, senderName, senderRole, text) {
  try {
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineageId, senderId, senderName, senderRole, text })
    });
  } catch (err) {
    console.error("Send message API failed:", err);
  }
}

// API ยิงเพิ่ม/ลบคำใบ้ และแก้ไขคำใบ้พิเศษ
async function apiAddHint(lineageId, hintText) {
  try {
    await fetch("/api/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", lineageId, hintText })
    });
  } catch (err) {
    console.error("Add hint API failed:", err);
  }
}

async function apiDeleteHint(lineageId, index) {
  try {
    await fetch("/api/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", lineageId, index })
    });
  } catch (err) {
    console.error("Delete hint API failed:", err);
  }
}

async function apiUpdateSpecialHint(lineageId, specialHintText) {
  try {
    await fetch("/api/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateSpecialHint", lineageId, specialHintText })
    });
  } catch (err) {
    console.error("Update special hint API failed:", err);
  }
}

// API ยิงเปิดเผย/ปิดบังสายรหัส
async function apiToggleReveal(lineageId, revealed) {
  try {
    const adminId = window.currentSession?.user?.id;
    await fetch("/api/lineages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineageId, revealed, adminId })
    });
  } catch (err) {
    console.error("Toggle reveal API failed:", err);
  }
}

// API เซฟคอนฟิกระบบวันงาน
async function apiSaveConfig(config) {
  try {
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    });
  } catch (err) {
    console.error("Save config API failed:", err);
  }
}


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INITIAL_LINEAGES, INITIAL_BUDDIES };
} else {
  window.INITIAL_BUDDIES = INITIAL_BUDDIES;
}
