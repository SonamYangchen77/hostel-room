require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://hostelroom_user:AbqVU5uRq6AHZeVfo0RKtTUyqD9BtG7N@dpg-d13quh0gjchc73ffhevg-a.oregon-postgres.render.com/hostelroom
',
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await pool.query(`
      INSERT INTO hostels (name, gender)
      VALUES 
        ('Sunrise Hostel', 'Male'),
        ('Moonlight Hostel', 'Female')
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log('✅ Seeded hostels successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding hostels:', err);
    process.exit(1);
  }
})();
