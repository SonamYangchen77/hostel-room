// models/Hostel.js
const { pool } = require('../config/db');

async function ensureHostelsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hostels (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
      -- add other columns as needed
    );
  `);
  console.log('✅ Hostels table ensured');
}

module.exports = { ensureHostelsTable };
