const { pool } = require('../config/db');

// Ensure hostels table exists and has 'gender' column
async function ensureHostelsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hostels (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    );
  `);

  await pool.query(`
    ALTER TABLE hostels
    ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
  `);

  console.log('✅ Hostels table ensured with gender column');
}

// 👉 Add this function to insert hostel
async function insertHostel(name, gender) {
  const result = await pool.query(
    `INSERT INTO hostels (name, gender) VALUES ($1, $2) RETURNING *;`,
    [name, gender]
  );
  console.log('✅ Hostel inserted:', result.rows[0]);
  return result.rows[0];
}

module.exports = {
  ensureHostelsTable,
  insertHostel, // export it
};
