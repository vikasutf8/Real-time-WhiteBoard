import React from 'react';

const UserCursors = ({ cursors }) => {
  // Generate consistent colors for user IDs
  const getUserColor = (userId) => {
    const colors = [
      '#ef4444', // red
      '#f97316', // orange
      '#eab308', // yellow
      '#22c55e', // green
      '#06b6d4', // cyan
      '#3b82f6', // blue
      '#8b5cf6', // violet
      '#ec4899'  // pink
    ];
    
    // Simple hash function to get consistent color for each user
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {Object.entries(cursors).map(([userId, position]) => (
        <div
          key={userId}
          className="absolute transition-all duration-75 ease-out"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-2px, -2px)'
          }}
        >
          {/* Cursor Icon */}
          <div
            className="relative"
            style={{ color: getUserColor(userId) }}
          >
            {/* Cursor SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="drop-shadow-sm"
            >
              <path d="M7.5 14.5l-1.5-1.5L12 7l6 6-1.5 1.5L12 10.5 7.5 14.5z" />
              <path d="M12 2L7 7h3v10h4V7h3l-5-5z" />
            </svg>
            
            {/* User ID Badge */}
            <div
              className="absolute top-5 left-5 px-2 py-1 rounded text-xs text-white font-medium whitespace-nowrap opacity-80"
              style={{ backgroundColor: getUserColor(userId) }}
            >
              User {userId.slice(-4)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCursors;