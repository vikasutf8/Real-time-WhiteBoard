import React from 'react';

const Toolbar = ({ drawingTool, onToolChange, socket }) => {
  const colors = [
    '#000000', // Black
    '#dc2626', // Red
    '#2563eb', // Blue
    '#16a34a'  // Green
  ];

  const strokeWidths = [1, 2, 4, 8];

  const handleColorChange = (color) => {
    onToolChange(prev => ({ ...prev, color }));
  };

  const handleWidthChange = (width) => {
    onToolChange(prev => ({ ...prev, width }));
  };

  const handleClearCanvas = () => {
    if (socket && window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      socket.emit('clear-canvas');
    }
  };

  return (
    <div className="h-full flex flex-col items-center py-4 space-y-6">
      {/* Color Palette */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600 text-center font-medium">Colors</p>
        <div className="space-y-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                drawingTool.color === color 
                  ? 'border-blue-500 scale-110' 
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={`Select ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Stroke Width */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600 text-center font-medium">Size</p>
        <div className="space-y-2">
          {strokeWidths.map((width) => (
            <button
              key={width}
              onClick={() => handleWidthChange(width)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                drawingTool.width === width 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              title={`Stroke width: ${width}px`}
            >
              <div
                className="rounded-full bg-gray-800"
                style={{
                  width: `${width + 2}px`,
                  height: `${width + 2}px`
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Width Slider */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600 text-center font-medium">
          Width: {drawingTool.width}px
        </p>
        <input
          type="range"
          min="1"
          max="20"
          value={drawingTool.width}
          onChange={(e) => handleWidthChange(parseInt(e.target.value))}
          className="w-12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
        />
      </div>

      {/* Clear Button */}
      <div className="mt-auto pt-4">
        <button
          onClick={handleClearCanvas}
          className="w-12 h-12 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center"
          title="Clear canvas"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;