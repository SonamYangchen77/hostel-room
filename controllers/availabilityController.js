const pool = require('../config/db');

// POST /check-availability: process form and render results
exports.checkAvailability = async (req, res) => {
  try {
    const { gender, hostelPreference } = req.body;

    if (!gender || !hostelPreference) {
      return res.status(400).send('Gender and hostel preference are required.');
    }

    // Query available rooms for given hostel and gender
    const query = `
      SELECT r.room_name, h.name AS hostel_name
      FROM rooms r
      JOIN hostels h ON r.hostel_id = h.id
      WHERE h.name = $1 AND h.gender ILIKE $2 AND r.is_available = true
      ORDER BY r.room_name
    `;

    const result = await pool.query(query, [hostelPreference, gender]);
    const rooms = result.rows;

    res.render('availability', {
      rooms,
      search: { gender, hostelPreference },
      totalAvailable: rooms.length
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).send('Server error');
  }
};
