const { pool } = require('../config/db');

const Room = {
  ensureRoomsTable: async () => {
    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        room_name VARCHAR(255) NOT NULL,
        hostel_id INTEGER REFERENCES hostels(id),
        is_available BOOLEAN DEFAULT true
      );
    `);

    // Add hostel_id column if it doesn't exist (for existing tables)
    await pool.query(`
      ALTER TABLE rooms
      ADD COLUMN IF NOT EXISTS hostel_id INTEGER REFERENCES hostels(id);
    `);

    console.log('✅ rooms table ensured with hostel_id column');
  },

  deleteRoom: async (roomName, hostelId) => {
    const query = `
      DELETE FROM rooms
      WHERE room_name = $1 AND hostel_id = $2
      RETURNING *;
    `;
    const values = [roomName, hostelId];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  setRoomAvailability: async (roomName, hostelId, isAvailable) => {
    const query = `
      UPDATE rooms
      SET is_available = $1
      WHERE room_name = $2 AND hostel_id = $3
      RETURNING *;
    `;
    const values = [isAvailable, roomName, hostelId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = Room;
