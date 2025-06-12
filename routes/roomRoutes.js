const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');


router.get('/manage-room', roomController.renderManageRoom);



// API routes for rooms
router.get('/api/rooms', roomController.getRooms);
router.post('/api/rooms', roomController.addRoom);
router.put('/api/rooms/:id', roomController.updateRoom);
router.delete('/api/rooms/:id', roomController.deleteRoom);

module.exports = router;
