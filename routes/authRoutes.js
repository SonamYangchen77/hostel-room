const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerification
} = require('../controllers/authController');

// Auth endpoints
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/verify', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/resend-verification', (req, res) => {
  res.render('resendVerification'); // render a form where user can enter email
});

router.post('/resend-verification', resendVerification);
module.exports = router;
