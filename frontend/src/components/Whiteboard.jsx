import React, { useState, useEffect } from 'react';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

const Whiteboard = ({ socket, roomId, onLeaveRoom }) => {
  const [drawingTool, setDrawingTool] = useState({
    color: '#000000',
    width: 2
  });
  const [userCount, setUserCount] = useState(1);
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    if (!socket) return;

    // Listen for user count updates
    socket.on('user-count', (count) => {
      setUserCount(count);
    });

    // Listen for cursor updates
    socket.on('cursor-update', (data) => {
      setCursors(prev => ({
        ...prev,
        [data.userId]: { x: data.x, y: data.y }
      }));
    });

    // Clean up cursors when users disconnect
    socket.on('user-disconnected', (userId) => {
      setCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[userId];
        return newCursors;
      });
    });

    return () => {
      socket.off('user-count');
      socket.off('cursor-update');
      socket.off('user-disconnected');
    };
  }, [socket]);

  const handleCursorMove = (x, y) => {
    if (socket) {
      socket.emit('cursor-move', { x, y });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Whiteboard
          </h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Room: {roomId}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            {userCount} user{userCount !== 1 ? 's' : ''} online
          </span>
        </div>
        
        <button
          onClick={onLeaveRoom}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Leave Room
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Toolbar */}
        <div className="w-20 bg-white shadow-sm">
          <Toolbar 
            drawingTool={drawingTool}
            onToolChange={setDrawingTool}
            socket={socket}
          />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <DrawingCanvas
            socket={socket}
            drawingTool={drawingTool}
            onCursorMove={handleCursorMove}
          />
          <UserCursors cursors={cursors} />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;