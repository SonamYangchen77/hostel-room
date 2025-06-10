const pool = require('./config/db');

const initDatabase = async () => {
  try {
    // Create `activities` table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        action TEXT NOT NULL,
        user_name TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "activities" created.');

    // Create `rooms` table with hostel_id (if that's what `r` refers to)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        hostel_id INTEGER NOT NULL,
        room_number TEXT NOT NULL,
        is_available BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Table "rooms" created with "hostel_id".');

    // Optional: create `hostels` table if needed
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hostels (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);
    console.log('✅ Table "hostels" created.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error initializing DB:', err);
    process.exit(1);
  }
};

initDatabase();
