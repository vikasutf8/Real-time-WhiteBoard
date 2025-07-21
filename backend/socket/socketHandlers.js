const {Room} =require("../models/Room.js")

// Track connected users per room
const roomUsers = new Map();

const socketHandlers = (socket, io) => {
  let currentRoom = null;
  let userId = socket.id;

  // Join room
  socket.on('join-room', async (roomId) => {
    try {
      currentRoom = roomId.toUpperCase();
      socket.join(currentRoom);
      
      // Add user to room tracking
      if (!roomUsers.has(currentRoom)) {
        roomUsers.set(currentRoom, new Set());
      }
      roomUsers.get(currentRoom).add(userId);
      
      // Get room data from database
      const room = await Room.findOne({ roomId: currentRoom });
      if (room) {
        // Send existing drawing data to the newly joined user
        socket.emit('load-drawing', room.drawingData);
      }
      
      // Broadcast user count to all users in room
      const userCount = roomUsers.get(currentRoom).size;
      io.to(currentRoom).emit('user-count', userCount);
      
      console.log(`User ${userId} joined room ${currentRoom}`);
      
    } catch (error) {
      console.error('Error joining room:', error);
    }
  });

  // Leave room
  socket.on('leave-room', () => {
    if (currentRoom && roomUsers.has(currentRoom)) {
      roomUsers.get(currentRoom).delete(userId);
      
      // Clean up empty room tracking
      if (roomUsers.get(currentRoom).size === 0) {
        roomUsers.delete(currentRoom);
      } else {
        // Broadcast updated user count
        const userCount = roomUsers.get(currentRoom).size;
        io.to(currentRoom).emit('user-count', userCount);
      }
      
      socket.leave(currentRoom);
      console.log(`User ${userId} left room ${currentRoom}`);
      currentRoom = null;
    }
  });

  // Handle cursor movement
  socket.on('cursor-move', (data) => {
    if (currentRoom) {
      socket.to(currentRoom).emit('cursor-update', {
        userId,
        x: data.x,
        y: data.y
      });
    }
  });

  // Handle drawing start
  socket.on('draw-start', async (data) => {
    if (currentRoom) {
      // Broadcast to other users in room
      socket.to(currentRoom).emit('draw-start', {
        x: data.x,
        y: data.y,
        color: data.color,
        width: data.width
      });
    }
  });

  // Handle drawing movement
  socket.on('draw-move', async (data) => {
    if (currentRoom) {
      // Broadcast to other users in room
      socket.to(currentRoom).emit('draw-move', {
        x: data.x,
        y: data.y
      });
    }
  });

  // Handle drawing end and save to database
  socket.on('draw-end', async (pathData) => {
    if (currentRoom) {
      try {
        // Save stroke to database
        const room = await Room.findOne({ roomId: currentRoom });
        if (room) {
          room.drawingData.push({
            type: 'stroke',
            data: pathData,
            timestamp: new Date()
          });
          await room.save();
        }
        
        // Broadcast to other users in room
        socket.to(currentRoom).emit('draw-end', pathData);
        
      } catch (error) {
        console.error('Error saving drawing:', error);
      }
    }
  });

  // Handle canvas clear
  socket.on('clear-canvas', async () => {
    if (currentRoom) {
      try {
        // Clear drawing data in database
        const room = await Room.findOne({ roomId: currentRoom });
        if (room) {
          room.drawingData.push({
            type: 'clear',
            data: {},
            timestamp: new Date()
          });
          await room.save();
        }
        
        // Broadcast clear to all users in room
        io.to(currentRoom).emit('canvas-cleared');
        
      } catch (error) {
        console.error('Error clearing canvas:', error);
      }
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (currentRoom && roomUsers.has(currentRoom)) {
      roomUsers.get(currentRoom).delete(userId);
      
      // Clean up empty room tracking
      if (roomUsers.get(currentRoom).size === 0) {
        roomUsers.delete(currentRoom);
      } else {
        // Broadcast updated user count
        const userCount = roomUsers.get(currentRoom).size;
        io.to(currentRoom).emit('user-count', userCount);
      }
    }
  });
};

module.exports = socketHandlers;