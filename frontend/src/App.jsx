import React, { useState, useEffect } from 'react';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';
import { useSocket } from './hooks/useSocket';

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socket = useSocket('http://localhost:5000');

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [socket]);

  const handleJoinRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('join-room', roomId);
      setCurrentRoom(roomId);
    }
  };

  const handleLeaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit('leave-room');
      setCurrentRoom(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Connection Status */}
      <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-sm z-50 ${
        isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      {!currentRoom ? (
        <RoomJoin onJoinRoom={handleJoinRoom} />
      ) : (
        <Whiteboard 
          socket={socket} 
          roomId={currentRoom} 
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;