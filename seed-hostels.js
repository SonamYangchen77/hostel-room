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
      INSERT INTO hostels (name, gender)
      VALUES 
        ('Yoentenling', 'Male'),
        ('Noebuling', 'Female'),
        ('Yearsholing', 'Female'),
        ('Rabtenling', 'Male')
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log('✅ Hostels seeded successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding hostels:', error);
    process.exit(1);
  }
}

seedHostels();
