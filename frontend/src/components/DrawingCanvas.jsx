import React, { useRef, useEffect, useState, useCallback } from 'react';
import { drawLine, clearCanvas } from '../utils/drawingUtils';

const DrawingCanvas = ({ socket, drawingTool, onCursorMove }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);

  // Drawing contexts for local and remote drawing
  const drawingContextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    drawingContextRef.current = ctx;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Configure canvas context
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Handle loading existing drawing data
    socket.on('load-drawing', (drawingData) => {
      const ctx = drawingContextRef.current;
      if (!ctx) return;

      clearCanvas(ctx);

      drawingData.forEach(command => {
        if (command.type === 'stroke' && command.data.path) {
          drawLine(ctx, command.data.path, command.data.color, command.data.width);
        } else if (command.type === 'clear') {
          clearCanvas(ctx);
        }
      });
    });

    // Handle remote drawing events
    socket.on('draw-start', (data) => {
      // Start a new path for remote user
    });

    socket.on('draw-move', (data) => {
      // This is handled by draw-end with complete path
    });

    socket.on('draw-end', (pathData) => {
      const ctx = drawingContextRef.current;
      if (!ctx || !pathData.path) return;
      
      drawLine(ctx, pathData.path, pathData.color, pathData.width);
    });

    socket.on('canvas-cleared', () => {
      const ctx = drawingContextRef.current;
      if (!ctx) return;
      clearCanvas(ctx);
    });

    return () => {
      socket.off('load-drawing');
      socket.off('draw-start');
      socket.off('draw-move');
      socket.off('draw-end');
      socket.off('canvas-cleared');
    };
  }, [socket]);

  const getMousePos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const getTouchPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }, []);

  const startDrawing = useCallback((pos) => {
    setIsDrawing(true);
    setCurrentPath([pos]);
    
    if (socket) {
      socket.emit('draw-start', {
        x: pos.x,
        y: pos.y,
        color: drawingTool.color,
        width: drawingTool.width
      });
    }
  }, [socket, drawingTool]);

  const draw = useCallback((pos) => {
    if (!isDrawing) return;
    
    const ctx = drawingContextRef.current;
    if (!ctx) return;

    const newPath = [...currentPath, pos];
    setCurrentPath(newPath);

    // Draw locally immediately for smooth feedback
    if (newPath.length > 1) {
      const lastPos = newPath[newPath.length - 2];
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawingTool.color;
      ctx.lineWidth = drawingTool.width;
      
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    if (socket) {
      socket.emit('draw-move', { x: pos.x, y: pos.y });
    }
  }, [isDrawing, currentPath, socket, drawingTool]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing || currentPath.length === 0) return;
    
    setIsDrawing(false);
    
    const pathData = {
      path: currentPath,
      color: drawingTool.color,
      width: drawingTool.width
    };

    if (socket) {
      socket.emit('draw-end', pathData);
    }
    
    setCurrentPath([]);
  }, [isDrawing, currentPath, socket, drawingTool]);

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    const pos = getMousePos(e);
    startDrawing(pos);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    const pos = getMousePos(e);
    onCursorMove(pos.x, pos.y);
    draw(pos);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  // Touch events
  const handleTouchStart = (e) => {
    e.preventDefault();
    const pos = getTouchPos(e);
    startDrawing(pos);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const pos = getTouchPos(e);
    onCursorMove(pos.x, pos.y);
    draw(pos);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair bg-white"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={stopDrawing}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
};

export default DrawingCanvas;