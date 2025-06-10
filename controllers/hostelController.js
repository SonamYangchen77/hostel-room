const pool = require('../config/db');

// Get hostel names with total available rooms
exports.getAvailableHostels = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT h.id, h.name, h.gender, COUNT(r.id) AS available_rooms
      FROM hostels h
      LEFT JOIN rooms r ON h.id = r.hostel_id AND r.is_available = true
      GROUP BY h.id, h.name, h.gender
      ORDER BY h.name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching available hostels:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
