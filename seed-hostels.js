const { Pool } = require('pg');

// Replace this with your actual connection string
const pool = new Pool({
  connectionString: 'postgresql://hostelroom_user:AbqVU5uRq6AHZeVfo0RKtTUyqD9BtG7N@dpg-d13quh0gjchc73ffhevg-a.oregon-postgres.render.com/hostelroom',
  ssl: {
    rejectUnauthorized: false, // Only use this in development or trusted environments
  },
});
async function seedHostels() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hostels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        gender VARCHAR(10) NOT NULL
      );

      INSERT INTO hostels (name, gender)
      VALUES 
        ('Sunrise Hostel', 'Male'),
        ('Moonlight Hostel', 'Female'),
        ('Evergreen Hostel', 'Male'),
        ('Rose Hostel', 'Female')
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log('✅ Hostels seeded successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding hostels:', err);
    process.exit(1);
  }
}

seedHostels();
