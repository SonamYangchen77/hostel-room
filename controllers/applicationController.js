const Application = require('../models/Application');

exports.submitApplication = async (req, res) => {
  try {
    console.log('🚀 submitApplication called');
    console.log('📥 Request body:', req.body);

    const {
      room_name,
      hostel_name,
      applicant_name,
      student_id,
      email,
      contact_number,
      reason
    } = req.body;

    // Validation
    if (!room_name || !hostel_name || !applicant_name || !student_id || !email || !contact_number || !reason) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const result = await Application.createApplication({
      room_name,
      hostel_name,
      applicant_name,
      student_id,
      email,
      contact_number,
      reason
    });

    console.log('✅ Application saved:', result);

    res.json({ success: true, message: 'Application submitted successfully!' });
  } catch (err) {
    console.error('❌ Error submitting application:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
