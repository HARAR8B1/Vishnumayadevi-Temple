/**
 * db.js — PostgreSQL connection pool
 * Uses the pg library with SSL enabled for Render hosted databases.
 */
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render's self-signed certs
  },
  max: 10,              // max pool connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL pool error:", err.message);
});

/**
 * Convenience wrapper — run a parameterised query and return rows.
 * @param {string} text   SQL text with $1, $2 … placeholders
 * @param {Array}  params Values to bind
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== "production") {
      console.log(`   ⚡ query (${duration}ms): ${text.slice(0, 80)}`);
    }
    return res;
  } catch (err) {
    console.error("❌ DB query error:", err.message);
    console.error("   SQL:", text);
    throw err;
  }
}

/**
 * Test the database connection. Resolves true on success, throws on failure.
 */
async function testConnection() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    return true;
  } finally {
    client.release();
  }
}

module.exports = { pool, query, testConnection };
