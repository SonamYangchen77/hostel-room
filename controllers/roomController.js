const { pool } = require('../config/db');

exports.renderManageRoom = async (req, res) => {
  try {
    const hostelsResult = await pool.query('SELECT id, name, gender FROM hostels ORDER BY name');
    const hostels = hostelsResult.rows;

    console.log('Hostels fetched:', hostels); // <-- debug here

    res.render('manage-room', {
      hostels,
      currentPage: 'room-management',
    });
  } catch (err) {
    console.error('Error loading manage room page:', err);
    res.status(500).send('Server error');
  }
};
