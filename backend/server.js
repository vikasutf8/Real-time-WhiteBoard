const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const roomRoutes = require('./routes/rooms.js');
const socketHandlers = require('./socket/socketHandlers.js');
const connectDB =require("./config/database.js")



const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// middleware
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded());


// Routes
app.use('/api/rooms', roomRoutes);


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socketHandlers(socket, io);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


setInterval(async () => {
  try {
    const Room = require('./models/Room');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Room.deleteMany({ lastActivity: { $lt: twentyFourHoursAgo } });
    console.log('Cleaned up old rooms');
  } catch (error) {
    console.error('Error cleaning up rooms:', error);
  }
}, 60 * 60 * 1000);


// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const startServer = async () => {
    try {
      await connectDB();
      server.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

startServer();

