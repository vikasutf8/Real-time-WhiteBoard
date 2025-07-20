import React, { useState } from 'react';

const RoomJoin = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId: roomId.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        onJoinRoom(data.roomId);
      } else {
        alert('Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Error joining room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body to create new room
      });

      const data = await response.json();

      if (data.success) {
        onJoinRoom(data.roomId);
      } else {
        alert('Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error creating room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Collaborative Whiteboard
          </h1>
          <p className="text-gray-600">
            Join an existing room or create a new one to start collaborating
          </p>
        </div>

        <form onSubmit={handleJoinRoom} className="space-y-6">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
              Room Code
            </label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Enter room code (e.g., ABC123)"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono tracking-wider"
              maxLength={8}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !roomId.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Joining...' : 'Join Room'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button
          onClick={handleCreateRoom}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating...' : 'Create New Room'}
        </button>
      </div>
    </div>
  );
};

export default RoomJoin;