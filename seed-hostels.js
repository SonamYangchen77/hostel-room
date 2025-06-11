const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://hostelroom_user:AbqVU5uRq6AHZeVfo0RKtTUyqD9BtG7N@dpg-d13quh0gjchc73ffhevg-a/hostelroom',
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    await pool.query(`
      INSERT INTO hostels (name, gender)
      VALUES 
        ('Sunrise Hostel', 'Male'),
        ('Moonlight Hostel', 'Female');
    `);
    console.log('Hostels seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
})();
