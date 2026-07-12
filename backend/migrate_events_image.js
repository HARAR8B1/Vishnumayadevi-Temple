require("dotenv").config();
const { pool } = require("./db");

async function runMigration() {
  console.log("🚀 Starting Events Image Migration...");
  try {
    const client = await pool.connect();
    
    // Add image columns to events table if they don't exist
    await client.query(`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS image_data TEXT,
      ADD COLUMN IF NOT EXISTS mime_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS filename VARCHAR(255);
    `);
    
    console.log("✅ Successfully added image columns to events table.");
    client.release();
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    pool.end();
  }
}

runMigration();
