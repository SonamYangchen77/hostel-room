const { pool } = require('../config/db');

async function ensureHostelsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hostels (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      gender VARCHAR(50)
    );
  `);
  console.log('✅ Hostels table ensured');
}
await pool.query(`
      ALTER TABLE hostels
      ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
    `);
module.exports = { ensureHostelsTable };
