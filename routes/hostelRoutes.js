const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

router.get('/available', hostelController.getAvailableHostels);

module.exports = router;
