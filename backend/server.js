const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const roomRoutes = require('./routes/rooms');
const socketHandlers = require('./socket/socketHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

// Routes
app.use('/api/rooms', roomRoutes);

// Socket.io connection handling
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});