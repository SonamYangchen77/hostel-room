const { pool } = require('../config/db');

async function ensureHostelsTable() {
  // Create the hostels table if it doesn't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hostels (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
      -- gender will be added via ALTER TABLE
    );
  `);

  // Add gender column if it doesn't exist
  await pool.query(`
    ALTER TABLE hostels
    ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
  `);

  console.log('✅ Hostels table ensured with gender column');
}

module.exports = { ensureHostelsTable };
