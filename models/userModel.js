const pool = require('../config/db');  // PostgreSQL connection pool
const bcrypt = require('bcrypt');

// Create a new user with hashed password
exports.createUser = async (name, email, password) => {
  try {
    // Hash the plain text password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user details into the users table
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    return result.rows[0];  // Return the newly created user
  } catch (err) {
    if (err.code === '23505') {
      // 23505 = unique_violation (email already exists)
      throw new Error('Email already exists');
    }
    throw err;
  }
};

// Find a user by their email
exports.findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];  // Returns undefined if not found
};
