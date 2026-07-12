require("dotenv").config();
const { query } = require("./db");

const INITIAL_MEMBERS = [
  {
    name: "T.M. Karthikeyan",
    post: "President",
    mobile_number: "94442 91833, 73580 14644",
    sort_order: 1
  },
  {
    name: "R. Sakthivel",
    post: "Vice President",
    mobile_number: "9841087327",
    sort_order: 2
  },
  {
    name: "P. Sekar",
    post: "Secretary",
    mobile_number: "86107 96991",
    sort_order: 3
  },
  {
    name: "P. Ezhumalai",
    post: "Joint Secretary",
    mobile_number: "9840124605",
    sort_order: 4
  },
  {
    name: "M. Sivakumar",
    post: "Treasurer",
    mobile_number: "9962307330",
    sort_order: 5
  },
  {
    name: "N. Paramasivam",
    post: "Joint Treasurer",
    mobile_number: "9840221349, 8124574760",
    sort_order: 6
  }
];

async function migrate() {
  try {
    console.log("Creating committee_members table...");
    await query(`
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
    `);

    // Check if empty
    const { rows } = await query("SELECT COUNT(*) FROM committee_members");
    if (parseInt(rows[0].count) === 0) {
      console.log("Seeding initial committee members...");
      for (const m of INITIAL_MEMBERS) {
        await query(
          "INSERT INTO committee_members (name, post, mobile_number, sort_order) VALUES ($1, $2, $3, $4)",
          [m.name, m.post, m.mobile_number, m.sort_order]
        );
      }
      console.log("Seeded successfully.");
    } else {
      console.log("Table already has data. Skipping seed.");
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
