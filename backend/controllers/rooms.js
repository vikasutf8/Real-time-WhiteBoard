
const {Room} =require("../models/Room.js")
// Generate random room ID
const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };
  
const createUser =async (req, res) => {
    try {
      let { roomId } = req.body;
      console.log(roomId)
      // If no room ID provided, generate one
      if (!roomId) {
        roomId = generateRoomId();
        console.log(roomId,"flag false")
      } else {
        roomId = roomId.toUpperCase();
        console.log(roomId,"flag true")
      }
      
      let room = await Room.findOne({ roomId: roomId });
      console.log(room)
      // Create room if it doesn't exist
      if (!room) {
        room = new Room({ roomId });
        await room.save();
      } else {
        // Update last activity
        room.lastActivity = new Date();
        await room.save();
      }
      
      res.json({
        success: true,
        roomId: room.roomId,
        created: !room.createdAt || room.createdAt.getTime() === room.lastActivity.getTime()
      });
      
    } catch (error) {
      console.error('Error joining room:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }


  const userInfo=async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Room.findOne({ roomId: roomId.toUpperCase() });
      
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      
      // Update last activity
      room.lastActivity = new Date();
      await room.save();
      
      res.json({
        success: true,
        room: {
          roomId: room.roomId,
          createdAt: room.createdAt,
          drawingData: room.drawingData
        }
      });
      
    } catch (error) {
      console.error('Error getting room:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }


  module.exports ={
    createUser,userInfo
  }