# 🎨 Collaborative Whiteboard

> A **real-time** multi-user drawing canvas built with **MERN + Socket.io**.

---

## 📌 Overview
A browser-based whiteboard that lets any number of people draw together **in real time**.  
Rooms are created on-the-fly with short codes (e.g. `ABC123`), drawings are auto-saved to MongoDB, and everything works on both desktop and tablet.

---

## ✨ Features
- **Real-time collaboration** – everyone draws simultaneously.
- **Room-based system** – join via code or create instantly.
- **Live cursors** – see who is drawing and where.
- **Drawing tools** – pencil, stroke width, color picker.
- **Persistent storage** – room drawings survive server restarts.
- **Responsive UI** – works on phones, tablets, and desktops.

---

## 🛠️ What You Need to Do
1. **Clone** the repo.
2. **Install** backend & frontend dependencies.
3. **Start** MongoDB (local or Atlas).
4. **Run** the server (`npm run dev` inside `server`).
5. **Run** the client (`npm run dev` inside `client`).
6. **Open** `http://localhost:5173` and start drawing!

---

## 🔧 Technology Stack
| Layer        | Technologies |
|--------------|--------------|
| **Frontend** | React 18 + Vite, Tailwind CSS, Socket.io-client |
| **Backend**  | Node.js, Express, Socket.io, Mongoose |
| **Database** | MongoDB (Atlas or local) |

---

## 📖 API Documentation

### REST Endpoints (`/api`)
| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| `POST` | `/rooms/join` | Join or create room | `{ "roomId": "ABC123" }` | `{ success, roomId, created }` |
| `GET`  | `/rooms/:roomId` | Get room & drawing data | – | `{ success, room }` |

### WebSocket Events (`ws://localhost:5000`)
| Direction | Event | Payload | Purpose |
|-----------|-------|---------|---------|
| **Client → Server** | `join-room` | `{ roomId }` | Enter a room |
| | `cursor-move` | `{ x, y }` | Broadcast cursor |
| | `draw-start`, `draw-move`, `draw-end` | path data | Send strokes |
| | `clear-canvas` | – | Erase board |
| **Server → Client** | `load-drawing` | drawing history | Sync new user |
| | `user-count` | count | Show active users |
| | `cursor-update` | `{ id, x, y }` | Others’ cursors |
| | `draw-*` mirrors | same as above | Real-time strokes |
| | `canvas-cleared` | – | Board erased |

---

## 🚀 Deployment (Quick Guide)

1. **Set env vars**
   ```bash
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>