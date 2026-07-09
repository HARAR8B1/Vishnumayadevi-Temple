const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "vishnumayadevi-temple-secret-key-2026";

// Middleware
app.use(cors());
app.use(express.json());

// ─── Multer Config for Image Uploads ──────────────────────────
const uploadDir = path.join(__dirname, "..", "frontend", "public", "images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `upload-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|bmp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype.split("/")[1]);
    if (ext || mime) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

// ─── Admin Credentials ───────────────────────────────────────
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";

// ─── Auth Middleware ─────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// ─── In-Memory Store ──────────────────────────────────────────────
const contactSubmissions = [];

// ─── Temple Info ──────────────────────────────────────────────────
let templeInfo = {
  name: {
    en: "Sri Vishnu Maya Devi Amman Temple",
    ta: "ஸ்ரீ விஷ்ணு மாயா தேவி அம்மன் ஆலயம்",
  },
  tagline: {
    en: "A Sacred Abode of Divine Grace",
    ta: "தெய்வீக அருளின் புனித உறைவிடம்",
  },
  description: {
    en: "Sri Vishnu Maya Devi Amman Temple is a revered Hindu temple located in the serene neighbourhood of Pallikaranai, Chennai. The temple is dedicated to Goddess Vishnu Maya Devi Amman, a powerful manifestation of the Divine Mother. Devotees from across Chennai and beyond visit this sacred shrine to seek blessings for prosperity, health, and spiritual well-being. The temple is known for its vibrant festivals, traditional rituals, and the deeply spiritual atmosphere that envelops every visitor.",
    ta: "ஸ்ரீ விஷ்ணு மாயா தேவி அம்மன் ஆலயம் பள்ளிக்கரணையில் அமைந்திருக்கும் ஒரு புகழ்பெற்ற இந்து ஆலயமாகும். இந்த ஆலயம் அகிலாண்ட நாயகியான விஷ்ணு மாயா தேவி அம்மனுக்கு அர்ப்பணிக்கப்பட்டுள்ளது. பக்தர்களின் துயர் துடைத்து, செல்வமும் ஆரோக்கியமும் வழங்கக்கூடிய அன்னையை வழிபட சென்னை மற்றும் பல்வேறு பகுதிகளில் இருந்து பக்தர்கள் இங்கு வருகை தருகின்றனர். இங்கு நடைபெறும் சிறப்பான திருவிழாக்கள் மற்றும் அமைதியான ஆன்மீக சூழல் அனைவருக்கும் மன அமைதியைத் தரும்.",
  },
  address: {
    en: "Plot no. 28, Sai Ganesh Nagar, 1st Main Road, Jalladiyanpet, Pallikaranai, Chennai - 600100",
    ta: "எண் 28, சாய் கணேஷ் நகர், 1வது மெயின் ரோடு, ஜல்லடியன்பேட்டை, பள்ளிக்கரணை, சென்னை - 600100",
  },
  phone: "+91 94442 91833 / 73580 14644",
  email: "vishnumayadeviamman@gmail.com",
  rating: 4.6,
  reviewCount: 532,
  coordinates: {
    lat: 12.9228645,
    lng: 80.2083115,
  },
  timings: [
    {
      day: { en: "Monday", ta: "திங்கள்" },
      morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" },
      evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" },
    },
    {
      day: { en: "Tuesday", ta: "செவ்வாய்" },
      morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" },
      evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" },
    },
    {
      day: { en: "Wednesday", ta: "புதன்" },
      morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" },
      evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" },
    },
    {
      day: { en: "Thursday", ta: "வியாழன்" },
      morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" },
      evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" },
    },
    {
      day: { en: "Friday", ta: "வெள்ளி" },
      morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" },
      evening: { en: "4:00 PM – 9:30 PM", ta: "மாலை 4:00 – இரவு 9:30" },
    },
    {
      day: { en: "Saturday", ta: "சனி" },
      morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – மதியம் 12:00" },
      evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" },
    },
    {
      day: { en: "Sunday", ta: "ஞாயிறு" },
      morning: { en: "6:00 AM – 1:00 PM", ta: "காலை 6:00 – மதியம் 1:00" },
      evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – இரவு 9:00" },
    },
  ],
};

// ─── Gallery Images ───────────────────────────────────────────────
let galleryImages = [
  {
    id: 1,
    url: "/images/temple-exterior.png",
    title: { en: "Temple Gopuram", ta: "ஆலய கோபுரம்" },
    description: {
      en: "The majestic gopuram of Sri Vishnu Maya Devi Amman Temple adorned with intricate sculptures",
      ta: "சிற்ப கலைகளுடன் ஒளிரும் ஸ்ரீ விஷ்ணு மாயா தேவி அம்மன் ஆலயத்தின் பிரம்மாண்ட ராஜகோபுரம்",
    },
  },
  {
    id: 2,
    url: "/images/temple-interior.png",
    title: { en: "Sacred Sanctum", ta: "கருவறை" },
    description: {
      en: "The inner sanctum illuminated by the warm glow of traditional oil lamps",
      ta: "பாரம்பரிய அகல் விளக்குகளின் ஒளியில் ஒளிரும் கருவறை",
    },
  },
  {
    id: 3,
    url: "/images/temple-festival.png",
    title: { en: "Temple Festival", ta: "ஆலய திருவிழா" },
    description: {
      en: "Grand festival celebrations with vibrant decorations and devotional processions",
      ta: "பக்தர்கள் புடைசூழ நடைபெறும் பிரம்மாண்ட ஆலய திருவிழா கொண்டாட்டங்கள்",
    },
  },
  {
    id: 4,
    url: "/images/temple-mandapam.png",
    title: { en: "Pillared Mandapam", ta: "கல்தூண் மண்டபம்" },
    description: {
      en: "The beautifully carved stone mandapam in the temple courtyard",
      ta: "ஆலய வளாகத்தில் அமைந்துள்ள அழகிய கல்தூண் மண்டபம்",
    },
  },
  {
    id: 5,
    url: "/images/temple-evening.png",
    title: { en: "Evening Aarti", ta: "மாலை ஆரத்தி" },
    description: {
      en: "The temple bathed in the golden light of oil lamps during the evening aarti",
      ta: "மாலை ஆரத்தியின் போது தீப ஒளியில் மிளிரும் ஆலயம்",
    },
  },
  {
    id: 6,
    url: "/images/temple-flowers.png",
    title: { en: "Floral Offerings", ta: "புஷ்ப அலங்காரம்" },
    description: {
      en: "Fresh flower garlands and offerings arranged for the deity",
      ta: "அம்மனுக்கு அர்ப்பணிக்கப்பட்ட வண்ண மலர் மாலைகள்",
    },
  },
];

// ─── Events ───────────────────────────────────────────────────────
let events = [
  {
    id: 1,
    title: { en: "Aadi Pooram Festival", ta: "ஆடிப் பூரம் திருவிழா" },
    date: { en: "2026-07-25", ta: "25 ஜூலை 2026" },
    description: {
      en: "Grand celebration of Aadi Pooram with special abhishekam, alankaram, and procession of the deity.",
      ta: "சிறப்பு அபிஷேகம், அலங்காரம் மற்றும் அம்மன் வீதியுலாவுடன் பிரம்மாண்டமான ஆடிப் பூரம் கொண்டாட்டம்.",
    },
    type: "festival",
  },
  {
    id: 2,
    title: { en: "Navaratri Celebrations", ta: "நவராத்திரி கொண்டாட்டம்" },
    date: { en: "2026-10-01", ta: "01 அக்டோபர் 2026" },
    description: {
      en: "Nine nights of devotion with Golu display, special poojas, and Saraswati Pooja on the final day.",
      ta: "கொலு வைபவம், சிறப்பு பூஜைகள் மற்றும் நிறைவு நாளில் சரஸ்வதி பூஜையுடன் ஒன்பது நாள்கள் கொண்டாட்டம்.",
    },
    type: "festival",
  },
  {
    id: 3,
    title: { en: "Thai Pongal Special Pooja", ta: "தைப்பொங்கல் சிறப்பு பூஜை" },
    date: { en: "2027-01-15", ta: "15 ஜனவரி 2027" },
    description: {
      en: "Harvest festival celebrations with Pongal preparation in the temple premises and special prayers.",
      ta: "ஆலய வளாகத்தில் பொங்கல் வைத்து வழிபாடு செய்யும் அறுவடை திருநாள் சிறப்பு பூஜை.",
    },
    type: "festival",
  },
  {
    id: 4,
    title: { en: "Friday Special Abhishekam", ta: "வெள்ளிக்கிழமை சிறப்பு அபிஷேகம்" },
    date: { en: "Every Friday", ta: "ஒவ்வொரு வெள்ளிக்கிழமையும்" },
    description: {
      en: "Weekly special abhishekam with milk, sandalwood paste, and kumkumam for the presiding deity.",
      ta: "அம்மனுக்கு பால், சந்தனம், குங்குமம் ஆகியவற்றால் நடைபெறும் வாராந்திர சிறப்பு அபிஷேகம்.",
    },
    type: "weekly",
  },
  {
    id: 5,
    title: { en: "Full Moon (Pournami) Pooja", ta: "பௌர்ணமி பூஜை" },
    date: { en: "Monthly", ta: "மாதந்தோறும்" },
    description: {
      en: "Special pooja and archana performed on every full moon day with pradosham rituals.",
      ta: "ஒவ்வொரு பௌர்ணமி அன்றும் சிறப்பு பூஜைகள் மற்றும் அர்ச்சனையோடு வழிபாடு நடைபெறும்.",
    },
    type: "monthly",
  },
];

// ─── Donation Config ──────────────────────────────────────────────
let donationConfig = {
  bannerImages: [
    { id: 1, url: "/images/donation-banner-tamil.bmp", label: "Tamil Donation Banner" },
    { id: 2, url: "/images/donation-banner-english.png", label: "English Donation Banner" },
  ],
  qrImage: "/images/donation-qr.png",
  bankDetails: {
    accountName: "VISHNU MAYA DEVI AMMAN TEMPLE",
    bankName: "Indian Overseas Bank",
    branch: "Medavakkam Branch, Chennai - 600100",
    accountNo: "182201000003782",
    ifscCode: "IOBA0001822",
    upiId: "8148692490@iob",
  },
};

// ─── ID Counter Helpers ──────────────────────────────────────────
let galleryNextId = 7;
let eventsNextId = 6;
let donationBannerNextId = 3;

// ═══════════════════════════════════════════════════════════════════
// PUBLIC API ROUTES
// ═══════════════════════════════════════════════════════════════════

// GET /api/temple
app.get("/api/temple", (req, res) => {
  res.json({ success: true, data: templeInfo });
});

// GET /api/gallery
app.get("/api/gallery", (req, res) => {
  res.json({ success: true, data: galleryImages });
});

// GET /api/events
app.get("/api/events", (req, res) => {
  res.json({ success: true, data: events });
});

// GET /api/donation
app.get("/api/donation", (req, res) => {
  res.json({ success: true, data: donationConfig });
});

// POST /api/contact
app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;

  const errors = [];
  if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters long.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email address is required.");
  if (phone && !/^[+]?[\d\s\-()]{7,15}$/.test(phone)) errors.push("Please provide a valid phone number.");
  if (!message || message.trim().length < 10) errors.push("Message must be at least 10 characters long.");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const submission = {
    id: contactSubmissions.length + 1,
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : null,
    message: message.trim(),
    submittedAt: new Date().toISOString(),
  };

  contactSubmissions.push(submission);
  console.log(`📩 New contact submission from ${submission.name} (${submission.email})`);

  res.status(201).json({
    success: true,
    message: "Thank you for your inquiry! We will get back to you shortly.",
    data: { id: submission.id },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ═══════════════════════════════════════════════════════════════════
// ADMIN API ROUTES
// ═══════════════════════════════════════════════════════════════════

// ─── Admin Login ─────────────────────────────────────────────────
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: "admin", username }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ success: true, token, message: "Login successful" });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// ─── Verify Token ────────────────────────────────────────────────
app.get("/api/admin/verify", authMiddleware, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// ─── Image Upload ────────────────────────────────────────────────
app.post("/api/admin/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file provided." });
  }
  const imageUrl = `/images/${req.file.filename}`;
  res.json({ success: true, url: imageUrl, filename: req.file.filename });
});

// ─── Gallery CRUD ────────────────────────────────────────────────
app.get("/api/admin/gallery", authMiddleware, (req, res) => {
  res.json({ success: true, data: galleryImages });
});

app.post("/api/admin/gallery", authMiddleware, (req, res) => {
  const { url, title, description } = req.body;
  if (!url || !title) {
    return res.status(400).json({ success: false, message: "URL and title are required." });
  }
  const newImage = {
    id: galleryNextId++,
    url,
    title: typeof title === "string" ? { en: title, ta: title } : title,
    description: typeof description === "string" ? { en: description, ta: description } : (description || { en: "", ta: "" }),
  };
  galleryImages.push(newImage);
  res.status(201).json({ success: true, data: newImage });
});

app.put("/api/admin/gallery/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = galleryImages.findIndex((img) => img.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Image not found." });
  }
  const { url, title, description } = req.body;
  if (url) galleryImages[index].url = url;
  if (title) galleryImages[index].title = typeof title === "string" ? { en: title, ta: title } : title;
  if (description) galleryImages[index].description = typeof description === "string" ? { en: description, ta: description } : description;
  res.json({ success: true, data: galleryImages[index] });
});

app.delete("/api/admin/gallery/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = galleryImages.findIndex((img) => img.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Image not found." });
  }
  galleryImages.splice(index, 1);
  res.json({ success: true, message: "Image deleted." });
});

// ─── Events CRUD ─────────────────────────────────────────────────
app.get("/api/admin/events", authMiddleware, (req, res) => {
  res.json({ success: true, data: events });
});

app.post("/api/admin/events", authMiddleware, (req, res) => {
  const { title, date, description, type } = req.body;
  if (!title || !date) {
    return res.status(400).json({ success: false, message: "Title and date are required." });
  }
  const newEvent = {
    id: eventsNextId++,
    title: typeof title === "string" ? { en: title, ta: title } : title,
    date: typeof date === "string" ? { en: date, ta: date } : date,
    description: typeof description === "string" ? { en: description, ta: description } : (description || { en: "", ta: "" }),
    type: type || "festival",
  };
  events.push(newEvent);
  res.status(201).json({ success: true, data: newEvent });
});

app.put("/api/admin/events/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }
  const { title, date, description, type } = req.body;
  if (title) events[index].title = typeof title === "string" ? { en: title, ta: title } : title;
  if (date) events[index].date = typeof date === "string" ? { en: date, ta: date } : date;
  if (description) events[index].description = typeof description === "string" ? { en: description, ta: description } : description;
  if (type) events[index].type = type;
  res.json({ success: true, data: events[index] });
});

app.delete("/api/admin/events/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }
  events.splice(index, 1);
  res.json({ success: true, message: "Event deleted." });
});

// ─── Temple Info ─────────────────────────────────────────────────
app.get("/api/admin/temple", authMiddleware, (req, res) => {
  res.json({ success: true, data: templeInfo });
});

app.put("/api/admin/temple", authMiddleware, (req, res) => {
  const updates = req.body;
  templeInfo = { ...templeInfo, ...updates };
  res.json({ success: true, data: templeInfo });
});

// ─── Donation Config ─────────────────────────────────────────────
app.get("/api/admin/donation", authMiddleware, (req, res) => {
  res.json({ success: true, data: donationConfig });
});

app.put("/api/admin/donation", authMiddleware, (req, res) => {
  const updates = req.body;
  donationConfig = { ...donationConfig, ...updates };
  res.json({ success: true, data: donationConfig });
});

app.post("/api/admin/donation/banner", authMiddleware, (req, res) => {
  const { url, label } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: "Image URL is required." });
  }
  const newBanner = { id: donationBannerNextId++, url, label: label || "Banner" };
  donationConfig.bannerImages.push(newBanner);
  res.status(201).json({ success: true, data: newBanner });
});

app.delete("/api/admin/donation/banner/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = donationConfig.bannerImages.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Banner not found." });
  }
  donationConfig.bannerImages.splice(index, 1);
  res.json({ success: true, message: "Banner deleted." });
});

// ─── Contact Submissions (Admin View) ────────────────────────────
app.get("/api/admin/contacts", authMiddleware, (req, res) => {
  res.json({ success: true, data: contactSubmissions });
});

app.delete("/api/admin/contacts/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = contactSubmissions.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Submission not found." });
  }
  contactSubmissions.splice(index, 1);
  res.json({ success: true, message: "Submission deleted." });
});

// ═══════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`\n🙏 Sri Vishnu Maya Devi Amman Temple API`);
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   Admin panel: POST /api/admin/login (admin/admin)`);
});
