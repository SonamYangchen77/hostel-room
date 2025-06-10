const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.post('/check-availability', availabilityController.checkAvailability);

module.exports = router;
