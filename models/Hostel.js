const { pool } = require('../config/db');

async function ensureHostelsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hostels (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      gender VARCHAR(50)  -- Add gender column here
    );
  `);
  console.log('✅ Hostels table ensured');
}

module.exports = { ensureHostelsTable };
