const pool = require('../config/db');

exports.renderReportPage = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        room_name, 
        hostel_name, 
        applicant_name, 
        student_id, 
        email, 
        contact_number
       FROM applications
       WHERE status = 'approved'`
    );

    const reports = result.rows;

    const hostels = [...new Set(reports.map(r => r.hostel_name))];
    const rooms = [...new Set(reports.map(r => r.room_name))];

    res.render('report', {
      reports,
      hostels,
      rooms,
      currentPage: 'report'
    });
  } catch (error) {
    console.error('Error rendering report page:', error);
    res.status(500).send('Server error');
  }
};
