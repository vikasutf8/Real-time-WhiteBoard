const express = require('express');
const Room = require('../models/Room.js');
const { createUser, userInfo } = require('../controllers/rooms.js');

const router = express.Router();


// Join or create room
router.post('/join', createUser);

// Get room info and drawing data
router.get('/:roomId',userInfo );

module.exports = router;