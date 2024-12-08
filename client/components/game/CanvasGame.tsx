// components/game/CanvasGame.tsx

import React, { useRef, useEffect, useCallback } from 'react';
import { Mineral } from '../../models/Mineral';

interface CanvasGameProps {
  minerals: Mineral[];
  handleMineralClick: (id: number, value: number, image: string) => void;
  isGameOver: boolean;
  onClick?: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void; // Added onClick prop
}

const CanvasGame: React.FC<CanvasGameProps> = ({ minerals, handleMineralClick, isGameOver, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw each mineral
    minerals.forEach((mineral) => {
      const img = new Image();
      img.src = mineral.image;
      img.onload = () => {
        ctx.save();
        ctx.translate(mineral.x, mineral.y);
        ctx.rotate((mineral.rotation * Math.PI) / 180);
        ctx.drawImage(img, -mineral.radius, -mineral.radius, mineral.radius * 2, mineral.radius * 2);
        ctx.restore();
      };
    });
  }, [minerals]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      draw(ctx);
      requestAnimationFrame(render);
    };
    render();

    return () => {
      // Cleanup is handled by React
    };
  }, [draw]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
      onClick={onClick} // Attach onClick handler here
    />
  );
};

export default CanvasGame;
