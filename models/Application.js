const { pool } = require('../config/db');

// Ensure applications table exists
async function ensureApplicationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      room_name VARCHAR(255) NOT NULL,
      hostel_name VARCHAR(255) NOT NULL,
      applicant_name VARCHAR(255) NOT NULL,
      student_id INTEGER NOT NULL,
      email VARCHAR(255) NOT NULL,
      contact_number VARCHAR(50) NOT NULL,
      reason TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Applications table ensured');
}

const Application = {
  createApplication: async (applicationData) => {
    const {
      room_name,
      hostel_name,
      applicant_name,
      student_id,
      email,
      contact_number,
      reason
    } = applicationData;

    const query = `
      INSERT INTO applications (
        room_name, hostel_name, applicant_name,
        student_id, email, contact_number, reason
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      room_name,
      hostel_name,
      applicant_name,
      student_id,
      email,
      contact_number,
      reason
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getAllApplications: async () => {
    const result = await pool.query(`
      SELECT id, room_name, hostel_name, applicant_name,
             student_id, email, contact_number, reason,
             status, created_at
      FROM applications
      ORDER BY created_at DESC;
    `);
    return result.rows;
  },

  updateStatus: async (applicationId, status) => {
    const query = `
      UPDATE applications
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [status, applicationId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = { Application, ensureApplicationsTable };
