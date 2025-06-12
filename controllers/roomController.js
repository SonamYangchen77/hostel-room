const { pool } = require('../config/db');

const Room = {
  ensureRoomsTable: async () => {
    // Create rooms table with proper schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        room_name VARCHAR(255) NOT NULL,
        hostel_id INTEGER NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
        is_available BOOLEAN DEFAULT true
      );
    `);

    // Add hostel_id column if missing (for existing tables)
    await pool.query(`
      ALTER TABLE rooms
      ADD COLUMN IF NOT EXISTS hostel_id INTEGER REFERENCES hostels(id);
    `);

    console.log('✅ rooms table ensured with hostel_id column');
  },

  insertRoom: async (roomName, hostelId, isAvailable = true) => {
    const query = `
      INSERT INTO rooms (room_name, hostel_id, is_available)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [roomName, hostelId, isAvailable];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getAllRooms: async () => {
    const query = `
      SELECT rooms.id, rooms.room_name, rooms.is_available, 
             rooms.hostel_id, hostels.name AS hostel_name
      FROM rooms
      JOIN hostels ON rooms.hostel_id = hostels.id
      ORDER BY hostels.name, rooms.room_name;
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  updateRoom: async (id, roomName, hostelId, isAvailable) => {
    const query = `
      UPDATE rooms
      SET room_name = $1, hostel_id = $2, is_available = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [roomName, hostelId, isAvailable, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  deleteRoom: async (id) => {
    const query = `
      DELETE FROM rooms WHERE id = $1 RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = Room;
