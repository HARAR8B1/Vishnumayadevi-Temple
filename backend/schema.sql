-- ═══════════════════════════════════════════════════════════════════
-- schema.sql — Vishnumayadevi Temple Database Schema
-- Run once via: psql $DATABASE_URL -f schema.sql
-- Or automatically via seed.js
-- ═══════════════════════════════════════════════════════════════════

-- ─── Admin Users ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id           SERIAL PRIMARY KEY,
  username     VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  security_question VARCHAR(255),
  security_answer_hash TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Temple Info (single canonical row, JSONB for bilingual fields) ──────────
CREATE TABLE IF NOT EXISTS temple_info (
  id         SERIAL PRIMARY KEY,
  data       JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Gallery Images ──────────────────────────────────────────────────────────
-- image_data holds base64-encoded image so it survives server redeploys
CREATE TABLE IF NOT EXISTS gallery_images (
  id          SERIAL PRIMARY KEY,
  title       JSONB NOT NULL,
  description JSONB,
  image_data  TEXT,           -- base64 encoded image content
  mime_type   VARCHAR(50),
  filename    VARCHAR(255),
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Events ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id          SERIAL PRIMARY KEY,
  title       JSONB NOT NULL,
  date        JSONB NOT NULL,
  description JSONB,
  type        VARCHAR(50) DEFAULT 'festival',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Donation Config (single canonical row) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS donation_config (
  id         SERIAL PRIMARY KEY,
  data       JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Donation Banners ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donation_banners (
  id          SERIAL PRIMARY KEY,
  label       VARCHAR(255),
  image_data  TEXT,           -- base64 encoded image
  mime_type   VARCHAR(50),
  filename    VARCHAR(255),
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── QR Code Image ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qr_images (
  id          SERIAL PRIMARY KEY,
  image_data  TEXT NOT NULL,  -- base64 encoded QR image
  mime_type   VARCHAR(50),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Contact Submissions ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  phone        VARCHAR(50),
  message      TEXT NOT NULL,
  is_read      BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Audit / Activity Log ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(100) NOT NULL,
  action      VARCHAR(100) NOT NULL,   -- e.g. LOGIN, LOGOUT, PASSWORD_CHANGED, GALLERY_ADDED
  entity      VARCHAR(100),            -- e.g. gallery, events, temple_info
  entity_id   INT,                     -- ID of the affected record (nullable)
  description TEXT,                    -- Human-readable summary of what changed
  ip_address  VARCHAR(50),
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Receipt Template ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS receipt_template (
  id          SERIAL PRIMARY KEY,
  image_data  TEXT NOT NULL,
  mime_type   VARCHAR(50),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Committee Members ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS committee_members (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  post            VARCHAR(255) NOT NULL,
  mobile_number   VARCHAR(255),
  address         TEXT,
  id_proof_number VARCHAR(255),
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
