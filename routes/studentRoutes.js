const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/students', studentController.getStudentManagementPage);

router.delete('/api/students/:id', studentController.deleteStudent);

module.exports = router;
