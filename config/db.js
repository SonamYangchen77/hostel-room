require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function ensureUsersTable() {
  // Step 1: Create table if not exists (basic structure)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `);

  // Step 2: Ensure 'is_verified' column exists
  const isVerifiedCheck = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_verified';
  `);
  if (isVerifiedCheck.rows.length === 0) {
    console.log("🔧 Adding missing 'is_verified' column...");
    await pool.query(`
      ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT false;
    `);
  }

  // Step 3: Ensure 'verification_token' column exists
  const verificationTokenCheck = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'verification_token';
  `);
  if (verificationTokenCheck.rows.length === 0) {
    console.log("🔧 Adding missing 'verification_token' column...");
    await pool.query(`
      ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
    `);
  }

  // Step 4: Ensure 'verification_token_expires' column exists
  const tokenExpiryCheck = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'verification_token_expires';
  `);
  if (tokenExpiryCheck.rows.length === 0) {
    console.log("🔧 Adding missing 'verification_token_expires' column...");
    await pool.query(`
      ALTER TABLE users ADD COLUMN verification_token_expires TIMESTAMP;
    `);
  }

  // Step 5: Ensure 'password_reset_token' column exists
  const resetTokenCheck = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_reset_token';
  `);
  if (resetTokenCheck.rows.length === 0) {
    console.log("🔧 Adding missing 'password_reset_token' column...");
    await pool.query(`
      ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255);
    `);
  }

  // Step 6: Ensure 'password_reset_expires' column exists
  const resetExpiresCheck = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_reset_expires';
  `);
  if (resetExpiresCheck.rows.length === 0) {
    console.log("🔧 Adding missing 'password_reset_expires' column...");
    await pool.query(`
      ALTER TABLE users ADD COLUMN password_reset_expires TIMESTAMP;
    `);
  }

  console.log("✅ Ensured users table and all required columns exist");
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  ensureUsersTable,
  pool,
};
