const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Route to render the manage room page (server-rendered page)
router.get('/manage-room', roomController.renderManageRoom);

// API Endpoints
router.get('/api/rooms', roomController.getRooms);        // Get all rooms
router.post('/api/rooms', roomController.addRoom);        // Add new room
router.put('/api/rooms/:id', roomController.updateRoom);  // Update existing room
router.delete('/api/rooms/:id', roomController.deleteRoom); // Delete a room

module.exports = router;
