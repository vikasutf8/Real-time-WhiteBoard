// Drawing utility functions

export const drawLine = (ctx, path, color, width) => {
    if (!ctx || !path || path.length < 2) return;
  
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
  
    // Use quadratic curves for smoother lines
    for (let i = 1; i < path.length; i++) {
      const point = path[i];
      const prevPoint = path[i - 1];
      
      if (i === path.length - 1) {
        // Last point - draw straight line
        ctx.lineTo(point.x, point.y);
      } else {
        // Use quadratic curve for smoothness
        const nextPoint = path[i + 1];
        const cpx = (point.x + nextPoint.x) / 2;
        const cpy = (point.y + nextPoint.y) / 2;
        ctx.quadraticCurveTo(point.x, point.y, cpx, cpy);
      }
    }
  
    ctx.stroke();
    ctx.restore();
  };
  
  export const clearCanvas = (ctx) => {
    if (!ctx) return;
    
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  export const getDistance = (point1, point2) => {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Simplify path to reduce data size
  export const simplifyPath = (path, tolerance = 2) => {
    if (path.length <= 2) return path;
  
    const simplified = [path[0]];
    
    for (let i = 1; i < path.length - 1; i++) {
      const point = path[i];
      const lastPoint = simplified[simplified.length - 1];
      
      if (getDistance(point, lastPoint) >= tolerance) {
        simplified.push(point);
      }
    }
    
    // Always include the last point
    simplified.push(path[path.length - 1]);
    
    return simplified;
  };