/**
 * seed.js — Initialize the Render PostgreSQL database with schema + default data.
 *
 * Usage:
 *   node seed.js                          # full seed (skips if data exists)
 *   node seed.js --force                  # wipe and re-seed everything
 *   node seed.js --reset-password <pwd>   # update admin password only
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { pool, query, testConnection } = require("./db");
require("dotenv").config();

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const RESET_PWD_IDX = args.indexOf("--reset-password");
const NEW_PASSWORD = RESET_PWD_IDX !== -1 ? args[RESET_PWD_IDX + 1] : null;

// ─── Default admin credentials ────────────────────────────────────────────────
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123"; // Change this after first login

// ─── Default Temple Info ──────────────────────────────────────────────────────
const defaultTempleInfo = {
  name: {
    en: "Sri Vishnu Maya Devi Amman Temple",
    ta: "ஸ்ரீ விஷ்ணு மாயா தேவி அம்மன் ஆலயம்",
  },
  tagline: {
    en: "A Sacred Abode of Divine Grace",
    ta: "தெய்வீக அருளின் புனித உறைவிடம்",
  },
  description: {
    en: "Sri Vishnu Maya Devi Amman Temple is a revered Hindu temple located in the serene neighbourhood of Pallikaranai, Chennai. The temple is dedicated to Goddess Vishnu Maya Devi Amman, a powerful manifestation of the Divine Mother. Devotees from across Chennai and beyond visit this sacred shrine to seek blessings for prosperity, health, and spiritual well-being.",
    ta: "ஸ்ரீ விஷ்ணு மாயா தேவி அம்மன் ஆலயம் பள்ளிக்கரணையில் அமைந்திருக்கும் ஒரு புகழ்பெற்ற இந்து ஆலயமாகும். இந்த ஆலயம் அகிலாண்ட நாயகியான விஷ்ணு மாயா தேவி அம்மனுக்கு அர்ப்பணிக்கப்பட்டுள்ளது. பக்தர்களின் துயர் துடைத்து, செல்வமும் ஆரோக்கியமும் வழங்கக்கூடிய அன்னையை வழிபட பக்தர்கள் இங்கு வருகை தருகின்றனர்.",
  },
  address: {
    en: "Plot no. 28, Sai Ganesh Nagar, 1st Main Road, Jalladiyanpet, Pallikaranai, Chennai - 600100",
    ta: "எண் 28, சாய் கணேஷ் நகர், 1வது மெயின் ரோடு, ஜல்லடியன்பேட்டை, பள்ளிக்கரணை, சென்னை - 600100",
  },
  phone: "+91 94442 91833 / 73580 14644",
  email: "vishnumayadeviamman@gmail.com",
  rating: 4.6,
  reviewCount: 532,
  coordinates: { lat: 12.9228645, lng: 80.2083115 },
  timings: [
    { day: { en: "Monday",    ta: "திங்கள்"  }, morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" }, evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" } },
    { day: { en: "Tuesday",   ta: "செவ்வாய்" }, morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" }, evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" } },
    { day: { en: "Wednesday", ta: "புதன்"    }, morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" }, evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" } },
    { day: { en: "Thursday",  ta: "வியாழன்"  }, morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" }, evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" } },
    { day: { en: "Friday",    ta: "வெள்ளி"   }, morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" }, evening: { en: "4:00 PM – 9:30 PM", ta: "மாலை 4:00 – இரவு 9:30" } },
    { day: { en: "Saturday",  ta: "சனி"      }, morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" }, evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" } },
    { day: { en: "Sunday",    ta: "ஞாயிறு"   }, morning: { en: "6:00 AM – 1:00 PM",  ta: "காலை 6:00 – மதியம் 1:00"  }, evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" } },
  ],
};

// ─── Default Events ───────────────────────────────────────────────────────────
const defaultEvents = [
  {
    title: { en: "Aadi Pooram Festival", ta: "ஆடிப் பூரம் திருவிழா" },
    date: { en: "2026-07-25", ta: "25 ஜூலை 2026" },
    description: { en: "Grand celebration of Aadi Pooram with special abhishekam, alankaram, and procession of the deity.", ta: "சிறப்பு அபிஷேகம், அலங்காரம் மற்றும் அம்மன் வீதியுலாவுடன் பிரம்மாண்டமான ஆடிப் பூரம் கொண்டாட்டம்." },
    type: "festival",
  },
  {
    title: { en: "Navaratri Celebrations", ta: "நவராத்திரி கொண்டாட்டம்" },
    date: { en: "2026-10-01", ta: "01 அக்டோபர் 2026" },
    description: { en: "Nine nights of devotion with Golu display, special poojas, and Saraswati Pooja on the final day.", ta: "கொலு வைபவம், சிறப்பு பூஜைகள் மற்றும் நிறைவு நாளில் சரஸ்வதி பூஜையுடன் ஒன்பது நாள்கள் கொண்டாட்டம்." },
    type: "festival",
  },
  {
    title: { en: "Thai Pongal Special Pooja", ta: "தைப்பொங்கல் சிறப்பு பூஜை" },
    date: { en: "2027-01-15", ta: "15 ஜனவரி 2027" },
    description: { en: "Harvest festival celebrations with Pongal preparation in the temple premises and special prayers.", ta: "ஆலய வளாகத்தில் பொங்கல் வைத்து வழிபாடு செய்யும் அறுவடை திருநாள் சிறப்பு பூஜை." },
    type: "festival",
  },
  {
    title: { en: "Friday Special Abhishekam", ta: "வெள்ளிக்கிழமை சிறப்பு அபிஷேகம்" },
    date: { en: "Every Friday", ta: "ஒவ்வொரு வெள்ளிக்கிழமையும்" },
    description: { en: "Weekly special abhishekam with milk, sandalwood paste, and kumkumam for the presiding deity.", ta: "அம்மனுக்கு பால், சந்தனம், குங்குமம் ஆகியவற்றால் நடைபெறும் வாராந்திர சிறப்பு அபிஷேகம்." },
    type: "weekly",
  },
  {
    title: { en: "Full Moon (Pournami) Pooja", ta: "பௌர்ணமி பூஜை" },
    date: { en: "Monthly", ta: "மாதந்தோறும்" },
    description: { en: "Special pooja and archana performed on every full moon day with pradosham rituals.", ta: "ஒவ்வொரு பௌர்ணமி அன்றும் சிறப்பு பூஜைகள் மற்றும் அர்ச்சனையுடன் வழிபாடு நடைபெறும்." },
    type: "monthly",
  },
];

// ─── Default Donation Config ──────────────────────────────────────────────────
const defaultDonationConfig = {
  bankDetails: {
    accountName: "VISHNU MAYA DEVI AMMAN TEMPLE",
    bankName:    "Indian Overseas Bank",
    branch:      "Medavakkam Branch, Chennai - 600100",
    accountNo:   "182201000003782",
    ifscCode:    "IOBA0001822",
    upiId:       "8148692490@iob",
  },
};

// ─────────────────────────────────────────────────────────────────────────────

async function runSchema() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await pool.query(sql);
  console.log("✅ Schema applied");
}

async function wipeAllData() {
  await pool.query("DELETE FROM gallery_images");
  await pool.query("DELETE FROM events");
  await pool.query("DELETE FROM temple_info");
  await pool.query("DELETE FROM donation_config");
  await pool.query("DELETE FROM donation_banners");
  await pool.query("DELETE FROM contact_submissions");
  await pool.query("DELETE FROM admin_users");
  await pool.query("DELETE FROM qr_images");
  console.log("🗑️  All existing data wiped");
}

async function seedAdminUser(password) {
  const hash = await bcrypt.hash(password, 12);
  await query(
    `INSERT INTO admin_users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [ADMIN_USERNAME, hash]
  );
  console.log(`✅ Admin user seeded (username: ${ADMIN_USERNAME})`);
}

async function seedTempleInfo() {
  const { rows } = await query("SELECT id FROM temple_info LIMIT 1");
  if (rows.length > 0 && !FORCE) {
    console.log("ℹ️  Temple info already exists — skipping");
    return;
  }
  await query(
    `INSERT INTO temple_info (data) VALUES ($1)
     ON CONFLICT DO NOTHING`,
    [JSON.stringify(defaultTempleInfo)]
  );
  console.log("✅ Temple info seeded");
}

async function seedEvents() {
  const { rows } = await query("SELECT id FROM events LIMIT 1");
  if (rows.length > 0 && !FORCE) {
    console.log("ℹ️  Events already exist — skipping");
    return;
  }
  for (const e of defaultEvents) {
    await query(
      `INSERT INTO events (title, date, description, type) VALUES ($1, $2, $3, $4)`,
      [JSON.stringify(e.title), JSON.stringify(e.date), JSON.stringify(e.description), e.type]
    );
  }
  console.log(`✅ ${defaultEvents.length} events seeded`);
}

async function seedDonationConfig() {
  const { rows } = await query("SELECT id FROM donation_config LIMIT 1");
  if (rows.length > 0 && !FORCE) {
    console.log("ℹ️  Donation config already exists — skipping");
    return;
  }
  await query(
    `INSERT INTO donation_config (data) VALUES ($1)`,
    [JSON.stringify(defaultDonationConfig)]
  );
  console.log("✅ Donation config seeded");
}

async function main() {
  console.log("\n🙏 Sri Vishnu Maya Devi Amman Temple — Database Seeder");
  console.log("   Connecting to Render PostgreSQL...\n");

  try {
    await testConnection();
    console.log("✅ Database connection successful\n");

    // Run schema (creates tables if they don't exist)
    await runSchema();

    // Handle --reset-password flag
    if (NEW_PASSWORD) {
      await seedAdminUser(NEW_PASSWORD);
      console.log(`\n✅ Admin password updated to: ${NEW_PASSWORD}`);
      process.exit(0);
    }

    // Full seed or force re-seed
    if (FORCE) {
      await wipeAllData();
    }

    await seedAdminUser(ADMIN_PASSWORD);
    await seedTempleInfo();
    await seedEvents();
    await seedDonationConfig();

    console.log("\n🎉 Database seeding complete!");
    console.log(`   Admin login: username=${ADMIN_USERNAME}, password=${ADMIN_PASSWORD}`);
    console.log("   ⚠️  Please change the admin password after first login.\n");
  } catch (err) {
    console.error("\n❌ Seeding failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
