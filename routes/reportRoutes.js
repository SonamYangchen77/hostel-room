const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/report', reportController.renderReportPage);

module.exports = router;
