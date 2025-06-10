async function addGenderColumnIfNotExists() {
  const query = `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='hostels' AND column_name='gender'
      ) THEN
        ALTER TABLE hostels ADD COLUMN gender VARCHAR(50);
      END IF;
    END
    $$;
  `;
  await pool.query(query);
  console.log('✅ Gender column ensured in hostels table');
}
