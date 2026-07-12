/**
 * server.js — Sri Vishnu Maya Devi Amman Temple API
 * PostgreSQL-backed, production-ready Express server.
 *
 * All data is persisted in the Render PostgreSQL database.
 * Images are stored as base64 in the DB (survives server redeploys).
 */

const express  = require("express");
const cors     = require("cors");
const jwt      = require("jsonwebtoken");
const multer   = require("multer");
const bcrypt   = require("bcryptjs");
const path     = require("path");
require("dotenv").config();

const { query, testConnection } = require("./db");

const app        = express();
const PORT       = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "vishnumayadevi-temple-secret-key-2026";

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "20mb" })); // allow large base64 payloads

// ─── Multer (memory storage — we store images in DB not disk) ─────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|bmp|svg/;
    const ext  = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype.split("/")[1]);
    if (ext || mime) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

// ─── Auth Middleware ───────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin     = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// ─── Helper: convert file buffer to base64 data URL ───────────────────────────
function bufferToBase64(buffer, mimetype) {
  return `data:${mimetype};base64,${buffer.toString("base64")}`;
}

// ─── Helper: write to audit_logs (non-blocking, best-effort) ──────────────────
function auditLog(req, { username, action, entity = null, entityId = null, description = null }) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    || req.socket?.remoteAddress
    || null;
  const ua = req.headers["user-agent"] || null;

  query(
    `INSERT INTO audit_logs (username, action, entity, entity_id, description, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [username, action, entity, entityId, description, ip, ua]
  ).catch((err) => console.error("⚠️  Audit log write failed:", err.message));
}


// ─── Helper: format gallery row from DB ───────────────────────────────────────
function formatGalleryRow(row) {
  return {
    id:          row.id,
    url:         `/api/images/gallery/${row.id}`,
    title:       row.title,
    description: row.description || { en: "", ta: "" },
    filename:    row.filename,
    sort_order:  row.sort_order,
    created_at:  row.created_at,
  };
}

// ─── Helper: format event row ──────────────────────────────────────────────────
function formatEventRow(row) {
  return {
    id:          row.id,
    title:       row.title,
    date:        row.date,
    description: row.description || { en: "", ta: "" },
    type:        row.type,
    imageUrl:    row.image_data ? `/api/images/event/${row.id}` : null,
    created_at:  row.created_at,
  };
}

// ─── Helper: format donation banner row ───────────────────────────────────────
function formatBannerRow(row) {
  return {
    id:    row.id,
    url:   `/api/images/banner/${row.id}`,
    label: row.label,
  };
}

// ─── Helper: format main photo row ────────────────────────────────────────────
function formatMainPhotoRow(row) {
  return {
    id:         row.id,
    url:        `/api/images/main-photo/${row.id}`,
    label:      row.label || "",
    section:    row.section || "hero",
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

// ─── Ensure main_photos table exists ──────────────────────────────────────────
async function ensureMainPhotosTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS main_photos (
      id          SERIAL PRIMARY KEY,
      label       VARCHAR(255),
      section     VARCHAR(50)  DEFAULT 'hero',
      image_data  TEXT         NOT NULL,
      mime_type   VARCHAR(50),
      filename    VARCHAR(255),
      sort_order  INT          DEFAULT 0,
      created_at  TIMESTAMPTZ  DEFAULT NOW()
    )
  `);
}
ensureMainPhotosTable().catch((err) => console.error("⚠️  main_photos table ensure failed:", err.message));

// ─── Ensure donations (accounts) table exists ──────────────────────────────────
async function ensureDonationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS donations (
      id            SERIAL PRIMARY KEY,
      receipt_no    VARCHAR(100),
      donor_name    VARCHAR(255)   NOT NULL,
      address       TEXT,
      received_from VARCHAR(255),
      towards       VARCHAR(255),
      amount        NUMERIC(12,2)  NOT NULL DEFAULT 0,
      amount_words  VARCHAR(500),
      date          DATE           NOT NULL DEFAULT CURRENT_DATE,
      notes         TEXT,
      created_at    TIMESTAMPTZ    DEFAULT NOW()
    )
  `);
}
ensureDonationsTable().catch((err) => console.error("⚠️  donations table ensure failed:", err.message));

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE SERVING ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// Serve gallery image by ID
app.get("/api/images/gallery/:id", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT image_data, mime_type FROM gallery_images WHERE id = $1",
      [req.params.id]
    );
    if (!rows.length || !rows[0].image_data) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }
    const { image_data, mime_type } = rows[0];
    // image_data may be a full data URL or raw base64
    if (image_data.startsWith("data:")) {
      const base64 = image_data.split(",")[1];
      const buffer = Buffer.from(base64, "base64");
      res.set("Content-Type", mime_type || "image/jpeg");
      res.set("Cache-Control", "public, max-age=86400");
      return res.send(buffer);
    }
    const buffer = Buffer.from(image_data, "base64");
    res.set("Content-Type", mime_type || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (err) {
    console.error("Image serve error:", err);
    res.status(500).json({ success: false, message: "Failed to serve image" });
  }
});

// Serve main photo by ID
app.get("/api/images/main-photo/:id", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT image_data, mime_type FROM main_photos WHERE id = $1",
      [req.params.id]
    );
    if (!rows.length || !rows[0].image_data) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }
    const { image_data, mime_type } = rows[0];
    const base64 = image_data.startsWith("data:") ? image_data.split(",")[1] : image_data;
    const buffer = Buffer.from(base64, "base64");
    res.set("Content-Type", mime_type || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (err) {
    console.error("Main photo serve error:", err);
    res.status(500).json({ success: false, message: "Failed to serve photo" });
  }
});

// Serve donation banner image by ID
app.get("/api/images/banner/:id", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT image_data, mime_type FROM donation_banners WHERE id = $1",
      [req.params.id]
    );
    if (!rows.length || !rows[0].image_data) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    const { image_data, mime_type } = rows[0];
    if (image_data.startsWith("data:")) {
      const base64 = image_data.split(",")[1];
      const buffer = Buffer.from(base64, "base64");
      res.set("Content-Type", mime_type || "image/jpeg");
      res.set("Cache-Control", "public, max-age=86400");
      return res.send(buffer);
    }
    const buffer = Buffer.from(image_data, "base64");
    res.set("Content-Type", mime_type || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to serve banner" });
  }
});

// Serve QR image
app.get("/api/images/qr", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT image_data, mime_type FROM qr_images ORDER BY id DESC LIMIT 1"
    );
    if (!rows.length || !rows[0].image_data) {
      return res.status(404).json({ success: false, message: "QR image not found" });
    }
    const { image_data, mime_type } = rows[0];
    const base64 = image_data.startsWith("data:") ? image_data.split(",")[1] : image_data;
    const buffer = Buffer.from(base64, "base64");
    res.set("Content-Type", mime_type || "image/png");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to serve QR image" });
  }
});

// Serve receipt template image
app.get("/api/images/receipt-template", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT image_data, mime_type FROM receipt_template ORDER BY id DESC LIMIT 1"
    );
    if (!rows.length || !rows[0].image_data) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    const { image_data, mime_type } = rows[0];
    const base64 = image_data.startsWith("data:") ? image_data.split(",")[1] : image_data;
    const buffer = Buffer.from(base64, "base64");
    res.set("Content-Type", mime_type || "image/png");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to serve template" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/health — includes DB connectivity check
app.get("/api/health", async (req, res) => {
  try {
    await testConnection();
    res.json({ status: "ok", db: "ok", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "ok", db: "error", timestamp: new Date().toISOString() });
  }
});

// GET /api/temple
app.get("/api/temple", async (req, res) => {
  try {
    const { rows } = await query("SELECT data FROM temple_info ORDER BY id DESC LIMIT 1");
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Temple info not found. Run seed.js first." });
    }
    res.json({ success: true, data: rows[0].data });
  } catch (err) {
    console.error("GET /api/temple error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET /api/gallery
app.get("/api/gallery", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, title, description, filename, sort_order, created_at FROM gallery_images ORDER BY sort_order ASC, created_at ASC"
    );
    res.json({ success: true, data: rows.map(formatGalleryRow) });
  } catch (err) {
    console.error("GET /api/gallery error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET /api/main-photos  — public, returns all photos grouped-able by section
app.get("/api/main-photos", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, label, section, filename, sort_order, created_at FROM main_photos ORDER BY section ASC, sort_order ASC, created_at ASC"
    );
    res.json({ success: true, data: rows.map(formatMainPhotoRow) });
  } catch (err) {
    console.error("GET /api/main-photos error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET /api/committee
app.get("/api/committee", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM committee_members ORDER BY sort_order ASC, id ASC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("GET /api/committee error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET /api/events
app.get("/api/events", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM events ORDER BY created_at ASC");
    res.json({ success: true, data: rows.map(formatEventRow) });
  } catch (err) {
    console.error("GET /api/events error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET /api/donation
app.get("/api/donation", async (req, res) => {
  try {
    const [configRes, bannersRes, qrRes] = await Promise.all([
      query("SELECT data FROM donation_config ORDER BY id DESC LIMIT 1"),
      query("SELECT id, label, filename FROM donation_banners ORDER BY sort_order ASC, created_at ASC"),
      query("SELECT id FROM qr_images ORDER BY id DESC LIMIT 1"),
    ]);

    const config     = configRes.rows[0]?.data || {};
    const banners    = bannersRes.rows.map(formatBannerRow);
    const hasQr      = qrRes.rows.length > 0;

    res.json({
      success: true,
      data: {
        ...config,
        bannerImages: banners,
        qrImage: hasQr ? "/api/images/qr" : null,
      },
    });
  } catch (err) {
    console.error("GET /api/donation error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// POST /api/contact
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  const errors = [];
  if (!name || name.trim().length < 2)          errors.push("Name must be at least 2 characters long.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email address is required.");
  if (phone && !/^[+]?[\d\s\-()]{7,15}$/.test(phone))      errors.push("Please provide a valid phone number.");
  if (!message || message.trim().length < 10)   errors.push("Message must be at least 10 characters long.");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const { rows } = await query(
      `INSERT INTO contact_submissions (name, email, phone, message)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name.trim(), email.trim(), phone?.trim() || null, message.trim()]
    );
    console.log(`📩 New contact from ${name.trim()} (${email.trim()})`);
    res.status(201).json({
      success: true,
      message: "Thank you for your inquiry! We will get back to you shortly.",
      data: { id: rows[0].id },
    });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    res.status(500).json({ success: false, message: "Failed to save contact submission." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN API ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Admin Login ──────────────────────────────────────────────────────────────
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }
  try {
    const { rows } = await query(
      "SELECT username, password_hash FROM admin_users WHERE username = $1",
      [username]
    );
    if (!rows.length) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) {
      auditLog(req, { username, action: "LOGIN_FAILED", description: "Invalid password attempt" });
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ role: "admin", username: rows[0].username }, JWT_SECRET, { expiresIn: "24h" });
    auditLog(req, { username: rows[0].username, action: "LOGIN", description: "Admin logged in successfully" });
    res.json({ success: true, token, message: "Login successful" });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "Login failed. Try again." });
  }
});

// ─── Admin Logout ─────────────────────────────────────────────────────────────
app.post("/api/admin/logout", authMiddleware, (req, res) => {
  auditLog(req, { username: req.admin.username, action: "LOGOUT", description: "Admin logged out" });
  res.json({ success: true, message: "Logged out successfully." });
});

// ─── Verify Token ─────────────────────────────────────────────────────────────
app.get("/api/admin/verify", authMiddleware, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// ─── Change Admin Password ────────────────────────────────────────────────────
app.put("/api/admin/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Both current and new password required." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
  }
  try {
    const { rows } = await query(
      "SELECT password_hash FROM admin_users WHERE username = $1",
      [req.admin.username]
    );
    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }
    const hash = await bcrypt.hash(newPassword, 12);
    await query(
      "UPDATE admin_users SET password_hash = $1 WHERE username = $2",
      [hash, req.admin.username]
    );
    auditLog(req, {
      username: req.admin.username,
      action: "PASSWORD_CHANGED",
      description: "Admin password was changed successfully",
    });
    res.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to change password." });
  }
});

// ─── Set Security Question ──────────────────────────────────────────────────
app.put("/api/admin/security-question", authMiddleware, async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ success: false, message: "Question and answer are required." });
  }
  try {
    const hash = await bcrypt.hash(answer.trim().toLowerCase(), 12);
    await query(
      "UPDATE admin_users SET security_question = $1, security_answer_hash = $2 WHERE username = $3",
      [question, hash, req.admin.username]
    );
    auditLog(req, {
      username: req.admin.username,
      action: "SECURITY_QUESTION_SET",
      description: "Admin updated their security question",
    });
    res.json({ success: true, message: "Security question updated successfully." });
  } catch (err) {
    console.error("Set security question error:", err);
    res.status(500).json({ success: false, message: "Failed to set security question." });
  }
});

// ─── Get Security Question ──────────────────────────────────────────────────
app.get("/api/admin/security-question/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const { rows } = await query(
      "SELECT security_question FROM admin_users WHERE username = $1",
      [username]
    );
    if (!rows.length || !rows[0].security_question) {
      return res.status(404).json({ success: false, message: "No security question found for this user." });
    }
    res.json({ success: true, question: rows[0].security_question });
  } catch (err) {
    console.error("Get security question error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch security question." });
  }
});

// ─── Reset Password via Security Question ───────────────────────────────────
app.post("/api/admin/reset-password", async (req, res) => {
  const { username, answer, newPassword } = req.body;
  if (!username || !answer || !newPassword) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
  }
  try {
    const { rows } = await query(
      "SELECT security_answer_hash FROM admin_users WHERE username = $1",
      [username]
    );
    if (!rows.length || !rows[0].security_answer_hash) {
      return res.status(404).json({ success: false, message: "Security settings not configured." });
    }
    const valid = await bcrypt.compare(answer.trim().toLowerCase(), rows[0].security_answer_hash);
    if (!valid) {
      auditLog(req, { username, action: "RESET_PASSWORD_FAILED", description: "Failed reset attempt (incorrect answer)" });
      return res.status(401).json({ success: false, message: "Incorrect answer." });
    }
    const hash = await bcrypt.hash(newPassword, 12);
    await query(
      "UPDATE admin_users SET password_hash = $1 WHERE username = $2",
      [hash, username]
    );
    auditLog(req, {
      username,
      action: "PASSWORD_RESET",
      description: "Admin password was reset via security question",
    });
    res.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Failed to reset password." });
  }
});

// ─── Image Upload (stores in DB, returns API URL) ─────────────────────────────
app.post("/api/admin/upload", authMiddleware, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file provided." });
  }
  try {
    const imageData = bufferToBase64(req.file.buffer, req.file.mimetype);
    const { rows } = await query(
      `INSERT INTO gallery_images (title, description, image_data, mime_type, filename)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [
        JSON.stringify({ en: req.file.originalname, ta: req.file.originalname }),
        JSON.stringify({ en: "", ta: "" }),
        imageData,
        req.file.mimetype,
        req.file.originalname,
      ]
    );
    const imageUrl = `/api/images/gallery/${rows[0].id}`;
    res.json({ success: true, url: imageUrl, id: rows[0].id, filename: req.file.originalname });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Failed to store image." });
  }
});

// ─── Upload QR Image ──────────────────────────────────────────────────────────
app.post("/api/admin/upload/qr", authMiddleware, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No QR image provided." });
  }
  try {
    const imageData = bufferToBase64(req.file.buffer, req.file.mimetype);
    // Delete old QR, insert new
    await query("DELETE FROM qr_images");
    await query(
      "INSERT INTO qr_images (image_data, mime_type) VALUES ($1, $2)",
      [imageData, req.file.mimetype]
    );
    res.json({ success: true, url: "/api/images/qr", message: "QR image updated." });
  } catch (err) {
    console.error("QR upload error:", err);
    res.status(500).json({ success: false, message: "Failed to upload QR image." });
  }
});

// ─── Upload Receipt Template Image ────────────────────────────────────────────
app.post("/api/admin/receipt-template", authMiddleware, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No template image provided." });
  }
  try {
    const imageData = bufferToBase64(req.file.buffer, req.file.mimetype);
    await query("DELETE FROM receipt_template");
    await query(
      "INSERT INTO receipt_template (image_data, mime_type) VALUES ($1, $2)",
      [imageData, req.file.mimetype]
    );
    auditLog(req, { username: req.admin.username, action: "RECEIPT_TEMPLATE_UPDATED", description: "Updated receipt template image" });
    res.json({ success: true, url: "/api/images/receipt-template", message: "Receipt template updated." });
  } catch (err) {
    console.error("Receipt template upload error:", err);
    res.status(500).json({ success: false, message: "Failed to upload receipt template." });
  }
});

app.delete("/api/admin/receipt-template", authMiddleware, async (req, res) => {
  try {
    await query("DELETE FROM receipt_template");
    auditLog(req, { username: req.admin.username, action: "RECEIPT_TEMPLATE_DELETED", description: "Deleted receipt template image" });
    res.json({ success: true, message: "Receipt template deleted." });
  } catch (err) {
    console.error("Receipt template delete error:", err);
    res.status(500).json({ success: false, message: "Failed to delete receipt template." });
  }
});

// ─── Upload Donation Banner ───────────────────────────────────────────────────
app.post("/api/admin/upload/banner", authMiddleware, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No banner image provided." });
  }
  try {
    const imageData = bufferToBase64(req.file.buffer, req.file.mimetype);
    const label     = req.body.label || req.file.originalname;
    const { rows }  = await query(
      `INSERT INTO donation_banners (label, image_data, mime_type, filename)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [label, imageData, req.file.mimetype, req.file.originalname]
    );
    res.status(201).json({
      success: true,
      data: { id: rows[0].id, url: `/api/images/banner/${rows[0].id}`, label },
    });
  } catch (err) {
    console.error("Banner upload error:", err);
    res.status(500).json({ success: false, message: "Failed to upload banner." });
  }
});

// ─── Gallery CRUD ──────────────────────────────────────────────────────────────
app.get("/api/admin/gallery", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, title, description, filename, sort_order, created_at FROM gallery_images ORDER BY sort_order ASC, created_at ASC"
    );
    res.json({ success: true, data: rows.map(formatGalleryRow) });
  } catch (err) {
    console.error("Admin GET gallery error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post("/api/admin/gallery", authMiddleware, upload.single("image"), async (req, res) => {
  const { title, description, url } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: "Title is required." });
  }

  try {
    let imageData = null;
    let mimeType  = null;
    let filename  = null;

    if (req.file) {
      imageData = bufferToBase64(req.file.buffer, req.file.mimetype);
      mimeType  = req.file.mimetype;
      filename  = req.file.originalname;
    } else if (url) {
      // External URL — store the URL directly as image_data marker
      imageData = url;
      filename  = url.split("/").pop();
    }

    const titleObj = typeof title === "string"
      ? JSON.parse(title)
      : title;
    const descObj = description
      ? (typeof description === "string" ? JSON.parse(description) : description)
      : { en: "", ta: "" };

    const { rows } = await query(
      `INSERT INTO gallery_images (title, description, image_data, mime_type, filename)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, filename, sort_order, created_at`,
      [JSON.stringify(titleObj), JSON.stringify(descObj), imageData, mimeType, filename]
    );
    auditLog(req, { username: req.admin.username, action: "GALLERY_IMAGE_ADDED", entity: "gallery", entityId: rows[0].id, description: `Added image: ${filename || "URL"}` });
    res.status(201).json({ success: true, data: formatGalleryRow(rows[0]) });
  } catch (err) {
    console.error("Admin POST gallery error:", err);
    res.status(500).json({ success: false, message: "Failed to add gallery image." });
  }
});

app.put("/api/admin/gallery/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description } = req.body;
  try {
    const existing = await query("SELECT * FROM gallery_images WHERE id = $1", [id]);
    if (!existing.rows.length) {
      return res.status(404).json({ success: false, message: "Image not found." });
    }

    const titleObj = title
      ? (typeof title === "string" ? JSON.parse(title) : title)
      : existing.rows[0].title;
    const descObj = description
      ? (typeof description === "string" ? JSON.parse(description) : description)
      : existing.rows[0].description;

    const { rows } = await query(
      `UPDATE gallery_images SET title = $1, description = $2
       WHERE id = $3 RETURNING id, title, description, filename, sort_order, created_at`,
      [JSON.stringify(titleObj), JSON.stringify(descObj), id]
    );
    auditLog(req, { username: req.admin.username, action: "GALLERY_IMAGE_UPDATED", entity: "gallery", entityId: id, description: `Updated image ${id}` });
    res.json({ success: true, data: formatGalleryRow(rows[0]) });
  } catch (err) {
    console.error("Admin PUT gallery error:", err);
    res.status(500).json({ success: false, message: "Failed to update gallery image." });
  }
});

app.delete("/api/admin/gallery/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rowCount } = await query("DELETE FROM gallery_images WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: "Image not found." });
    }
    auditLog(req, { username: req.admin.username, action: "GALLERY_IMAGE_DELETED", entity: "gallery", entityId: id, description: `Deleted image ${id}` });
    res.json({ success: true, message: "Image deleted." });
  } catch (err) {
    console.error("Admin DELETE gallery error:", err);
    res.status(500).json({ success: false, message: "Failed to delete image." });
  }
});

// ─── Main Photos CRUD ─────────────────────────────────────────────────────────
// GET all
app.get("/api/admin/main-photos", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, label, section, filename, sort_order, created_at FROM main_photos ORDER BY section ASC, sort_order ASC, created_at ASC"
    );
    res.json({ success: true, data: rows.map(formatMainPhotoRow) });
  } catch (err) {
    console.error("Admin GET main-photos error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// POST upload new main photo
app.post("/api/admin/main-photos", authMiddleware, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file provided." });
  }
  try {
    const imageData  = bufferToBase64(req.file.buffer, req.file.mimetype);
    const label      = req.body.label || req.file.originalname;
    const section    = req.body.section || "hero";
    const sortOrder  = parseInt(req.body.sort_order) || 0;
    const { rows } = await query(
      `INSERT INTO main_photos (label, section, image_data, mime_type, filename, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, label, section, filename, sort_order, created_at`,
      [label, section, imageData, req.file.mimetype, req.file.originalname, sortOrder]
    );
    auditLog(req, { username: req.admin.username, action: "MAIN_PHOTO_ADDED", entity: "main_photos", entityId: rows[0].id, description: `Added main photo: ${label} (section: ${section})` });
    res.status(201).json({ success: true, data: formatMainPhotoRow(rows[0]) });
  } catch (err) {
    console.error("Admin POST main-photos error:", err);
    res.status(500).json({ success: false, message: "Failed to upload photo." });
  }
});

// DELETE main photo
app.delete("/api/admin/main-photos/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rowCount } = await query("DELETE FROM main_photos WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: "Photo not found." });
    }
    auditLog(req, { username: req.admin.username, action: "MAIN_PHOTO_DELETED", entity: "main_photos", entityId: id, description: `Deleted main photo ${id}` });
    res.json({ success: true, message: "Photo deleted." });
  } catch (err) {
    console.error("Admin DELETE main-photos error:", err);
    res.status(500).json({ success: false, message: "Failed to delete photo." });
  }
});

// PATCH update main photo metadata (label, section, sort_order)
app.patch("/api/admin/main-photos/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const { label, section, sort_order } = req.body;
  try {
    const { rows, rowCount } = await query(
      "UPDATE main_photos SET label = COALESCE($1, label), section = COALESCE($2, section), sort_order = COALESCE($3, sort_order) WHERE id = $4 RETURNING id, label, section, filename, sort_order, created_at",
      [label, section, sort_order, id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: "Photo not found." });
    }
    auditLog(req, { username: req.admin.username, action: "MAIN_PHOTO_UPDATED", entity: "main_photos", entityId: id, description: `Updated main photo metadata ${id}` });
    res.json({ success: true, data: formatMainPhotoRow(rows[0]) });
  } catch (err) {
    console.error("Admin PATCH main-photos error:", err);
    res.status(500).json({ success: false, message: "Failed to update photo." });
  }
});

// ─── Accounts / Donations CRUD ────────────────────────────────────────────────
app.get("/api/admin/donations", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM donations ORDER BY date DESC, id DESC");
    // Calculate total
    const totalResult = await query("SELECT SUM(amount) as total FROM donations");
    const total = totalResult.rows[0].total || 0;
    res.json({ success: true, data: rows, total });
  } catch (err) {
    console.error("Admin GET donations error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post("/api/admin/donations", authMiddleware, async (req, res) => {
  const { receipt_no, donor_name, address, received_from, towards, amount, amount_words, date, notes } = req.body;
  if (!donor_name) {
    return res.status(400).json({ success: false, message: "Donor name is required." });
  }
  try {
    const { rows } = await query(
      `INSERT INTO donations (receipt_no, donor_name, address, received_from, towards, amount, amount_words, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [receipt_no, donor_name, address, received_from, towards, amount || 0, amount_words, date || new Date().toISOString().split('T')[0], notes]
    );
    auditLog(req, { username: req.admin.username, action: "DONATION_ADDED", entity: "donations", entityId: rows[0].id, description: `Added donation from ${donor_name} of amount ${amount}` });
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Admin POST donations error:", err);
    res.status(500).json({ success: false, message: "Failed to add donation." });
  }
});

app.put("/api/admin/donations/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const { receipt_no, donor_name, address, received_from, towards, amount, amount_words, date, notes } = req.body;
  try {
    const { rows, rowCount } = await query(
      `UPDATE donations SET receipt_no = $1, donor_name = $2, address = $3, received_from = $4, towards = $5, amount = $6, amount_words = $7, date = $8, notes = $9 WHERE id = $10 RETURNING *`,
      [receipt_no, donor_name, address, received_from, towards, amount || 0, amount_words, date, notes, id]
    );
    if (rowCount === 0) return res.status(404).json({ success: false, message: "Donation not found." });
    auditLog(req, { username: req.admin.username, action: "DONATION_UPDATED", entity: "donations", entityId: id, description: `Updated donation ${id}` });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Admin PUT donations error:", err);
    res.status(500).json({ success: false, message: "Failed to update donation." });
  }
});

app.delete("/api/admin/donations/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rowCount } = await query("DELETE FROM donations WHERE id = $1", [id]);
    if (rowCount === 0) return res.status(404).json({ success: false, message: "Donation not found." });
    auditLog(req, { username: req.admin.username, action: "DONATION_DELETED", entity: "donations", entityId: id, description: `Deleted donation ${id}` });
    res.json({ success: true, message: "Donation deleted." });
  } catch (err) {
    console.error("Admin DELETE donations error:", err);
    res.status(500).json({ success: false, message: "Failed to delete donation." });
  }
});

// ─── Committee CRUD ───────────────────────────────────────────────────────────
app.post("/api/admin/committee", authMiddleware, async (req, res) => {
  const { name, post, mobile_number, address, id_proof_number } = req.body;
  if (!name || !post) {
    return res.status(400).json({ success: false, message: "Name and post are required." });
  }
  try {
    const { rows } = await query(
      `INSERT INTO committee_members (name, post, mobile_number, address, id_proof_number)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, post, mobile_number, address, id_proof_number]
    );
    auditLog(req, { username: req.admin.username, action: "COMMITTEE_MEMBER_ADDED", entity: "committee", entityId: rows[0].id, description: `Added member: ${name}` });
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Admin POST committee error:", err);
    res.status(500).json({ success: false, message: "Failed to add committee member." });
  }
});

app.put("/api/admin/committee/reorder", authMiddleware, async (req, res) => {
  const { items } = req.body; // Array of { id, sort_order }
  if (!Array.isArray(items)) {
    return res.status(400).json({ success: false, message: "Invalid payload format." });
  }
  try {
    for (const item of items) {
      await query("UPDATE committee_members SET sort_order = $1 WHERE id = $2", [item.sort_order, item.id]);
    }
    auditLog(req, { username: req.admin.username, action: "COMMITTEE_REORDERED", entity: "committee", description: "Reordered committee members" });
    res.json({ success: true, message: "Order updated successfully." });
  } catch (err) {
    console.error("Admin PUT committee reorder error:", err);
    res.status(500).json({ success: false, message: "Failed to update order." });
  }
});

app.put("/api/admin/committee/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, post, mobile_number, address, id_proof_number } = req.body;
  try {
    const { rows } = await query(
      `UPDATE committee_members SET name = $1, post = $2, mobile_number = $3, address = $4, id_proof_number = $5
       WHERE id = $6 RETURNING *`,
      [name, post, mobile_number, address, id_proof_number, id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }
    auditLog(req, { username: req.admin.username, action: "COMMITTEE_MEMBER_UPDATED", entity: "committee", entityId: id, description: `Updated member: ${name}` });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Admin PUT committee error:", err);
    res.status(500).json({ success: false, message: "Failed to update member." });
  }
});

app.delete("/api/admin/committee/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rowCount } = await query("DELETE FROM committee_members WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }
    auditLog(req, { username: req.admin.username, action: "COMMITTEE_MEMBER_DELETED", entity: "committee", entityId: id, description: `Deleted member ID: ${id}` });
    res.json({ success: true, message: "Member deleted." });
  } catch (err) {
    console.error("Admin DELETE committee error:", err);
    res.status(500).json({ success: false, message: "Failed to delete member." });
  }
});

// ─── Events CRUD ──────────────────────────────────────────────────────────────
app.get("/api/admin/events", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM events ORDER BY created_at ASC");
    res.json({ success: true, data: rows.map(formatEventRow) });
  } catch (err) {
    console.error("Admin GET events error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post("/api/admin/events", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const payload = req.body.data ? JSON.parse(req.body.data) : req.body;
    const { title, date, description, type } = payload;
    if (!title || !date) {
      return res.status(400).json({ success: false, message: "Title and date are required." });
    }

    const titleObj = typeof title === "string" ? { en: title, ta: title } : title;
    const dateObj  = typeof date  === "string" ? { en: date,  ta: date  } : date;
    const descObj  = description
      ? (typeof description === "string" ? { en: description, ta: description } : description)
      : { en: "", ta: "" };

    let image_data = null;
    let mime_type = null;
    let filename = null;

    if (req.file) {
      image_data = req.file.buffer.toString("base64");
      mime_type = req.file.mimetype;
      filename = req.file.originalname;
    }

    const { rows } = await query(
      `INSERT INTO events (title, date, description, type, image_data, mime_type, filename)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [JSON.stringify(titleObj), JSON.stringify(dateObj), JSON.stringify(descObj), type || "festival", image_data, mime_type, filename]
    );
    auditLog(req, { username: req.admin.username, action: "EVENT_CREATED", entity: "events", entityId: rows[0].id, description: `Created event: ${titleObj.en}` });
    res.status(201).json({ success: true, data: formatEventRow(rows[0]) });
  } catch (err) {
    console.error("Admin POST events error:", err);
    res.status(500).json({ success: false, message: "Failed to create event." });
  }
});

app.put("/api/admin/events/:id", authMiddleware, upload.single("image"), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const payload = req.body.data ? JSON.parse(req.body.data) : req.body;
    const { title, date, description, type } = payload;
    
    const existing = await query("SELECT * FROM events WHERE id = $1", [id]);
    if (!existing.rows.length) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    const cur = existing.rows[0];
    const titleObj = title
      ? (typeof title === "string" ? { en: title, ta: title } : title)
      : cur.title;
    const dateObj = date
      ? (typeof date === "string" ? { en: date, ta: date } : date)
      : cur.date;
    const descObj = description
      ? (typeof description === "string" ? { en: description, ta: description } : description)
      : cur.description;

    let image_data = cur.image_data;
    let mime_type = cur.mime_type;
    let filename = cur.filename;

    if (req.file) {
      image_data = req.file.buffer.toString("base64");
      mime_type = req.file.mimetype;
      filename = req.file.originalname;
    }

    const { rows } = await query(
      `UPDATE events SET title=$1, date=$2, description=$3, type=$4, image_data=$5, mime_type=$6, filename=$7 WHERE id=$8 RETURNING *`,
      [JSON.stringify(titleObj), JSON.stringify(dateObj), JSON.stringify(descObj), type || cur.type, image_data, mime_type, filename, id]
    );
    auditLog(req, { username: req.admin.username, action: "EVENT_UPDATED", entity: "events", entityId: id, description: `Updated event ${id}` });
    res.json({ success: true, data: formatEventRow(rows[0]) });
  } catch (err) {
    console.error("Admin PUT events error:", err);
    res.status(500).json({ success: false, message: "Failed to update event." });
  }
});

app.delete("/api/admin/events/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rowCount } = await query("DELETE FROM events WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    auditLog(req, { username: req.admin.username, action: "EVENT_DELETED", entity: "events", entityId: id, description: `Deleted event ${id}` });
    res.json({ success: true, message: "Event deleted." });
  } catch (err) {
    console.error("Admin DELETE events error:", err);
    res.status(500).json({ success: false, message: "Failed to delete event." });
  }
});

// ─── Temple Info CRUD ──────────────────────────────────────────────────────────
app.get("/api/admin/temple", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query("SELECT data FROM temple_info ORDER BY id DESC LIMIT 1");
    if (!rows.length) return res.status(404).json({ success: false, message: "Temple info not found." });
    res.json({ success: true, data: rows[0].data });
  } catch (err) {
    console.error("Admin GET temple error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.put("/api/admin/temple", authMiddleware, async (req, res) => {
  const updates = req.body;
  try {
    const { rows: existing } = await query("SELECT id, data FROM temple_info ORDER BY id DESC LIMIT 1");
    if (!existing.length) {
      // Create it if missing
      const { rows } = await query("INSERT INTO temple_info (data) VALUES ($1) RETURNING data", [JSON.stringify(updates)]);
      return res.json({ success: true, data: rows[0].data });
    }
    const merged = { ...existing[0].data, ...updates };
    const { rows } = await query(
      "UPDATE temple_info SET data=$1, updated_at=NOW() WHERE id=$2 RETURNING data",
      [JSON.stringify(merged), existing[0].id]
    );
    auditLog(req, { username: req.admin.username, action: "TEMPLE_INFO_UPDATED", entity: "temple_info", description: "Updated temple information" });
    res.json({ success: true, data: rows[0].data });
  } catch (err) {
    console.error("Admin PUT temple error:", err);
    res.status(500).json({ success: false, message: "Failed to update temple info." });
  }
});

// ─── Donation Config CRUD ──────────────────────────────────────────────────────
app.get("/api/admin/donation", authMiddleware, async (req, res) => {
  try {
    const [configRes, bannersRes, qrRes] = await Promise.all([
      query("SELECT data FROM donation_config ORDER BY id DESC LIMIT 1"),
      query("SELECT id, label, filename FROM donation_banners ORDER BY sort_order ASC, created_at ASC"),
      query("SELECT id FROM qr_images ORDER BY id DESC LIMIT 1"),
    ]);
    const config  = configRes.rows[0]?.data || {};
    const banners = bannersRes.rows.map(formatBannerRow);
    const hasQr   = qrRes.rows.length > 0;
    res.json({
      success: true,
      data: { ...config, bannerImages: banners, qrImage: hasQr ? "/api/images/qr" : null },
    });
  } catch (err) {
    console.error("Admin GET donation error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.put("/api/admin/donation", authMiddleware, async (req, res) => {
  const updates = req.body;
  try {
    const { rows: existing } = await query("SELECT id, data FROM donation_config ORDER BY id DESC LIMIT 1");
    if (!existing.length) {
      const { rows } = await query("INSERT INTO donation_config (data) VALUES ($1) RETURNING data", [JSON.stringify(updates)]);
      auditLog(req, { username: req.admin.username, action: "DONATION_CONFIG_CRITICAL_UPDATE", entity: "donation_config", description: "CRITICAL: Initial donation config added" });
      return res.json({ success: true, data: rows[0].data });
    }
    const merged = { ...existing[0].data, ...updates };
    const { rows } = await query(
      "UPDATE donation_config SET data=$1, updated_at=NOW() WHERE id=$2 RETURNING data",
      [JSON.stringify(merged), existing[0].id]
    );

    let logDescription = "CRITICAL: Donation account details or config updated";
    
    if (existing[0].data.bankDetails && updates.bankDetails) {
      const oldBank = existing[0].data.bankDetails;
      const newBank = updates.bankDetails;
      const changes = [];
      
      const fields = [
        { key: 'accountNo', label: 'Account Number' },
        { key: 'accountName', label: 'Account Name' },
        { key: 'upiId', label: 'UPI ID' },
        { key: 'bankName', label: 'Bank Name' },
        { key: 'ifscCode', label: 'IFSC Code' }
      ];
      
      fields.forEach(f => {
        if (newBank[f.key] !== undefined && newBank[f.key] !== oldBank[f.key]) {
          changes.push(`${f.label} changed from '${oldBank[f.key] || ""}' to '${newBank[f.key]}'`);
        }
      });
      
      if (changes.length > 0) {
        logDescription = "CRITICAL: " + changes.join("; ");
      }
    }

    auditLog(req, { username: req.admin.username, action: "DONATION_CONFIG_CRITICAL_UPDATE", entity: "donation_config", description: logDescription });
    res.json({ success: true, data: rows[0].data });
  } catch (err) {
    console.error("Admin PUT donation error:", err);
    res.status(500).json({ success: false, message: "Failed to update donation config." });
  }
});

app.post("/api/admin/donation/banner", authMiddleware, upload.single("image"), async (req, res) => {
  const { url, label } = req.body;
  try {
    let imageData = null;
    let mimeType  = null;
    let filename  = null;

    if (req.file) {
      imageData = bufferToBase64(req.file.buffer, req.file.mimetype);
      mimeType  = req.file.mimetype;
      filename  = req.file.originalname;
    } else if (url) {
      imageData = url;
      filename  = url.split("/").pop();
    } else {
      return res.status(400).json({ success: false, message: "Image file or URL is required." });
    }

    const { rows } = await query(
      "INSERT INTO donation_banners (label, image_data, mime_type, filename) VALUES ($1,$2,$3,$4) RETURNING id",
      [label || "Banner", imageData, mimeType, filename]
    );
    res.status(201).json({
      success: true,
      data: { id: rows[0].id, url: `/api/images/banner/${rows[0].id}`, label: label || "Banner" },
    });
  } catch (err) {
    console.error("Admin POST donation banner error:", err);
    res.status(500).json({ success: false, message: "Failed to add banner." });
  }
});

app.delete("/api/admin/donation/banner/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rowCount } = await query("DELETE FROM donation_banners WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: "Banner not found." });
    }
    res.json({ success: true, message: "Banner deleted." });
  } catch (err) {
    console.error("Admin DELETE banner error:", err);
    res.status(500).json({ success: false, message: "Failed to delete banner." });
  }
});

// ─── Contact Submissions (Admin View) ─────────────────────────────────────────
app.get("/api/admin/contacts", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, name, email, phone, message, is_read, submitted_at FROM contact_submissions ORDER BY submitted_at DESC"
    );
    // Normalize field name to match existing frontend expectations
    const normalized = rows.map((r) => ({
      id:          r.id,
      name:        r.name,
      email:       r.email,
      phone:       r.phone,
      message:     r.message,
      isRead:      r.is_read,
      submittedAt: r.submitted_at,
    }));
    res.json({ success: true, data: normalized });
  } catch (err) {
    console.error("Admin GET contacts error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.patch("/api/admin/contacts/:id/read", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await query("UPDATE contact_submissions SET is_read=TRUE WHERE id=$1", [id]);
    res.json({ success: true, message: "Marked as read." });
  } catch (err) {
    console.error("Admin PATCH contacts error:", err);
    res.status(500).json({ success: false, message: "Failed to mark as read." });
  }
});

app.delete("/api/admin/contacts/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rowCount } = await query("DELETE FROM contact_submissions WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }
    res.json({ success: true, message: "Submission deleted." });
  } catch (err) {
    console.error("Admin DELETE contacts error:", err);
    res.status(500).json({ success: false, message: "Failed to delete submission." });
  }
});

// ─── Audit Logs ───────────────────────────────────────────────────────────────
/**
 * GET /api/admin/audit-logs
 * Query params:
 *   limit   (default 100, max 500)
 *   offset  (default 0)
 *   action  — filter by action keyword e.g. LOGIN, PASSWORD_CHANGED
 *   from    — ISO date string lower bound
 *   to      — ISO date string upper bound
 */
app.get("/api/admin/audit-logs", authMiddleware, async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit  || "100"), 500);
    const offset = parseInt(req.query.offset || "0");
    const action = req.query.action || null;
    const from   = req.query.from   || null;
    const to     = req.query.to     || null;

    const conditions = [];
    const params     = [];

    if (action) {
      params.push(`%${action.toUpperCase()}%`);
      conditions.push(`action ILIKE $${params.length}`);
    }
    if (from) {
      params.push(from);
      conditions.push(`created_at >= $${params.length}`);
    }
    if (to) {
      params.push(to);
      conditions.push(`created_at <= $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT id, username, action, entity, entity_id, description, ip_address, user_agent, created_at
       FROM audit_logs
       ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    // Get total count for pagination
    const countParams = params.slice(0, params.length - 2);
    const { rows: countRows } = await query(
      `SELECT COUNT(*) AS total FROM audit_logs ${where}`,
      countParams
    );

    res.json({
      success: true,
      data: rows,
      total: parseInt(countRows[0].total),
      limit,
      offset,
    });
  } catch (err) {
    console.error("GET audit-logs error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch audit logs" });
  }
});

// DELETE /api/admin/audit-logs — clear all logs (admin only)
app.delete("/api/admin/audit-logs", authMiddleware, async (req, res) => {
  try {
    await query("DELETE FROM audit_logs");
    auditLog(req, { username: req.admin.username, action: "AUDIT_LOGS_CLEARED", description: "All audit logs were cleared" });
    res.json({ success: true, message: "All audit logs cleared." });
  } catch (err) {
    console.error("DELETE audit-logs error:", err);
    res.status(500).json({ success: false, message: "Failed to clear audit logs" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════════

app.listen(PORT, async () => {
  console.log("\n🙏 Sri Vishnu Maya Devi Amman Temple API");
  console.log(`   Server: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);

  try {
    await testConnection();
    console.log("   Database: ✅ Connected to Render PostgreSQL\n");
  } catch (err) {
    console.error("   Database: ❌ Connection failed —", err.message);
    console.error("   Check DATABASE_URL in .env\n");
  }
});
