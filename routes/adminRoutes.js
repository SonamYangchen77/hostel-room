const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/landing', (req, res) => {
  res.render('landing');
});

router.get('/applications', adminController.renderApplicationsPage);
router.post('/applications/:id/approve', adminController.approveApplication);
router.post('/applications/:id/decline', adminController.declineApplication);

module.exports = router;
