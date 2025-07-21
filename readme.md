# Collaborative Whiteboard

A real-time collaborative whiteboard app built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.io**. Draw together, track cursors, and share ideas instantly with persistent rooms and smooth UX.

---

## Features

- **Room Management:** Create or join rooms with simple codes; auto-creates if not found.
- **Real-Time Collaboration:** Live drawing and cursor tracking for all users in a room.
- **Persistent Drawing Data:** All whiteboard data is saved and restored for new joiners.
- **Drawing Tools:** Adjustable color, stroke width, clear canvas, and smooth curve rendering.
- **User Experience:** Responsive UI, touch support for tablets, and real-time user count.
- **Performance:** Throttled updates, efficient data structures, and automatic cleanup of inactive rooms.

---

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Socket.io-client
- **Backend:** Node.js, Express, Socket.io, MongoDB (Mongoose)

---

## Project Structure

```
collaborative-whiteboard/
├── client/                     # React Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoomJoin.jsx   # Room joining component
│   │   │   ├── Whiteboard.jsx # Main whiteboard component
│   │   │   ├── DrawingCanvas.jsx # Canvas for drawing
│   │   │   ├── Toolbar.jsx # Drawing tools
│   │   │   └── UserCursors.jsx # Cursor tracking
│   │   ├── hooks/
│   │   │   └── useSocket.js # Socket connection management
│   │   ├── utils/
│   │   │   └── drawingUtils.js # Drawing utilities
│   │   ├── App.jsx # Main application component
│   │   ├── main.jsx # Entry point
│   │   └── index.css # Global styles
│   └── package.json
├── server/
    |--config
         - database.js 
    |-- controllers
         - roomController.js
    |-- models
         - Room.js
    |-- routes
         - rooms.js
    |-- socket
         - socketHandlers.js
    |-- server.js
    └── package.json
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud)
- npm or yarn

### Backend

```bash
cd server
npm install
# Ensure MongoDB is running at mongodb://localhost:27017
│   ├── server.js
│   └── package.json
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud)
- npm or yarn

### Backend

```bash
cd server
npm install
# Ensure MongoDB is running at mongodb://localhost:27017
npm run dev
# Server runs on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## API Documentation

### REST Endpoints

#### `POST /api/rooms/join`
Join or create a room.
- **Body:**  
  ```json
  { "roomId": "ABC123" } // Optional
  ```
- **Response:**  
  ```json
  { "success": true, "roomId": "ABC123", "created": false }
  ```

#### `GET /api/rooms/:roomId`
Get room info and drawing data.
- **Response:**  
  ```json
  {
    "success": true,
    "room": {
      "_id": "...",
      "roomId": "T4W2ZT",
      "createdAt": "...",
      "lastActivity": "...",
      "drawingData": [
        {
          "type": "stroke",
          "data": { ... },
          "timestamp": "...",
          "_id": "..."
        }
      ],
      "__v": 1
    }
  }
  ```

---

### Socket Events

#### Client → Server

- `join-room`
- `leave-room`
- `cursor-move`
- `draw-start`
- `draw-move`
- `draw-end`
- `clear-canvas`

#### Server → Client

- `load-drawing`
- `user-count`
- `cursor-update`
- `draw-start`
- `draw-move`
- `draw-end`
- `canvas-cleared`

---

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server │    │    MongoDB      │
│ - Drawing UI    │◄──►│ - REST APIs     │◄──►│ - Room Data     │
│ - Socket Client │    │ - Socket.io     │    │ - Drawing Data  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Data Flow:**
1. Client sends REST request to create/join room.
2. Establishes WebSocket connection.
3. Mouse/touch events sent via Socket.io.
4. Server broadcasts to all room participants.
5. Drawing data is persisted in MongoDB.
6. New users receive existing drawing data.

---

## Deployment Guide

### Production Setup

- Set environment variables:
  ```
  # Server
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/collaborative-whiteboard

  # Client
  VITE_SERVER_URL=https://your-server-domain.com
  ```
- Build client:
  ```bash
  cd client
  npm run build
  ```
- Serve static files from Express or a static host.
- Use MongoDB Atlas or a production MongoDB server.

### Deployment Options

- **Heroku:** Deploy server, connect to MongoDB Atlas.
- **DigitalOcean/AWS:** Use PM2 for backend, serve frontend via Nginx or Express.
- **Vercel/Netlify:** For frontend only (backend deployed separately).

---

## Production Considerations

- Enable MongoDB authentication.
- Use environment variables for secrets.
- Implement rate limiting on Socket.io.
- Add error logging and monitoring.
- Use HTTPS for secure sockets.
- Implement cleanup for inactive rooms.
- Add authentication if needed.
- Optimize frontend bundle size.

---

## Performance Features

- Throttled cursor updates (~60fps).
- Path simplification for efficient network usage.
- Automatic cleanup of inactive rooms (24h).
- Smooth quadratic curve rendering.
- Real-time local feedback.

---

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Touch devices (tablets) supported

---

## License

MIT

---