const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'render psql dpg-d13quh0gjchc73ffhevg-a', // or use process.env.DATABASE_URL
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    await pool.query(`
      INSERT INTO hostels (name, gender)
      VALUES 
        ('Yoentenling', 'Male'),
        ('Norbuling', 'Female')
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log('✅ Seeded hostels successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding hostels:', err);
    process.exit(1);
  }
})();
