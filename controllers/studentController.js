// controllers/studentController.js
const pool = require('../config/db');

exports.getStudentManagementPage = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users");
    const students = result.rows;

    res.render('student-management', {
      currentPage: 'student-management',
      students: students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Server Error');
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  console.log('Delete request for student id:', id);

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    console.log('Delete result:', result);

    if (result.rowCount === 0) {
      console.log('Student not found');
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    console.log('Student deleted successfully');
    return res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({ success: false, message: 'Error deleting student' });
  }
};
