const { Application } = require('../models/Application');
const Room = require('../models/Room');
const { sendEmail } = require('../utils/email');

const adminController = {
  async renderApplicationsPage(req, res) {
    try {
      const applications = await Application.getAllApplications();
      res.render('applications', { applications, currentPage: 'applications' });
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).send('Server error');
    }
  },

  async approveApplication(req, res) {
    try {
      const applicationId = req.params.id;

      const app = await Application.updateStatus(applicationId, 'approved');

      // Remove the room from the database
      await Room.deleteRoom(app.room_name, app.hostel_name);

      // Send approval email
      await sendEmail(
        app.email,
        'Hostel Application Approved',
        `Dear ${app.applicant_name},\n\nYour room application has been approved.\n\nRoom: ${app.room_name}\nHostel: ${app.hostel_name}\n\nThank you!`
      );

      res.redirect('/applications');
    } catch (error) {
      console.error('Error approving application:', error);
      res.status(500).send('Server error');
    }
  },

  async declineApplication(req, res) {
    try {
      const applicationId = req.params.id;
      const reason = req.body.reason || 'Not specified';

      const app = await Application.updateStatus(applicationId, 'declined');

      await sendEmail(
        app.email,
        'Hostel Application Declined',
        `Dear ${app.applicant_name},\n\nYour room application was declined.\nReason: ${reason}\n\nThank you for your interest.`
      );

      res.redirect('/applications');
    } catch (error) {
      console.error('Error declining application:', error);
      res.status(500).send('Server error');
    }
  }
};

module.exports = adminController;
