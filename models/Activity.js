const { pool } = require('../config/db');

async function ensureActivitiesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      action VARCHAR(255) NOT NULL,
      user_name VARCHAR(100) NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Activities table ensured');
}

module.exports = { ensureActivitiesTable };
