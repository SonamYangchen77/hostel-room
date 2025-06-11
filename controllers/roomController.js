const pool = require('../config/db');

exports.renderManageRoom = async (req, res) => {
  try {
    const hostelsResult = await pool.query('SELECT id, name, gender FROM hostels ORDER BY name');
    const hostels = hostelsResult.rows;

    console.log('🔍 Hostels fetched for renderManageRoom:', hostels); // <-- ADD THIS

    res.render('manage-room', {
      hostels,
      currentPage: 'room-management',
    });
  } catch (err) {
    console.error('Error loading manage room page:', err);
    res.status(500).send('Server error');
  }
};





exports.getRooms = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rooms.id, rooms.hostel_id, rooms.room_name, rooms.is_available,
             hostels.name AS hostel_name, hostels.gender
      FROM rooms
      JOIN hostels ON rooms.hostel_id = hostels.id
      ORDER BY hostels.name, rooms.room_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.addRoom = async (req, res) => {
  try {
    let { hostel_id, room_name, is_available } = req.body;

    // Parse correctly
    hostel_id = parseInt(hostel_id, 10);
    is_available = is_available === true || is_available === 'true';

    if (!hostel_id || !room_name) {
      return res.status(400).json({ message: 'Missing hostel or room name.' });
    }

    // Validate hostel_id exists
    const hostelResult = await pool.query('SELECT id FROM hostels WHERE id = $1', [hostel_id]);

    if (hostelResult.rows.length === 0) {
      console.error('Hostel ID not found:', hostel_id);
      return res.status(400).json({ message: 'Invalid hostel ID.' });
    }

    await pool.query(
      `INSERT INTO rooms (hostel_id, room_name, is_available)
       VALUES ($1, $2, $3)`,
      [hostel_id, room_name, is_available]
    );

    res.status(201).json({ message: 'Room added successfully' });
  } catch (err) {
    console.error('Error adding room:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Corrected updateRoom: use room_name, do NOT update hostel_name or gender in rooms table
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    let { hostel_id, room_name, is_available } = req.body;

    hostel_id = parseInt(hostel_id, 10);
    is_available = is_available === true || is_available === 'true';

    if (!hostel_id || !room_name) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const hostelResult = await pool.query(
      'SELECT id FROM hostels WHERE id = $1',
      [hostel_id]
    );

    if (hostelResult.rows.length === 0) {
      console.error('Hostel ID not found for update:', hostel_id);
      return res.status(400).json({ message: 'Invalid hostel ID.' });
    }

    await pool.query(
      `UPDATE rooms 
       SET hostel_id = $1, room_name = $2, is_available = $3
       WHERE id = $4`,
      [hostel_id, room_name, is_available, id]
    );

    res.json({ message: 'Room updated successfully' });
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
