const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const applicationController = require('../controllers/applicationController');

router.post('/check-availability', availabilityController.checkAvailability);

// ✅ Use controller for POST /apply
router.post('/apply', applicationController.submitApplication);

module.exports = router;
