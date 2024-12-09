import React, { useRef, useEffect, useState, useCallback } from 'react';
import { mineralsData } from '../../constants/gameData';

interface Mineral {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  image: string;
  value: number;
}

interface GameCanvasProps {
  onMineralClick: (id: number, value: number, image: string) => void;
  isGameOver: boolean;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setCollectedMinerals: React.Dispatch<
    React.SetStateAction<Record<string, { count: number; value: number }>>
  >;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  onMineralClick,
  isGameOver,
  setIsGameOver,
  setCollectedMinerals,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [minerals, setMinerals] = useState<Mineral[]>([]);

  const spawnMineral = useCallback(() => {
    const randomMineral = mineralsData[Math.floor(Math.random() * mineralsData.length)];
    const canvas = canvasRef.current;

    if (canvas) {
      setMinerals((prev) => [
        ...prev,
        {
          id: Math.random(),
          x: Math.random() * canvas.width,
          y: 0,
          radius: 20,
          speed: 2 + Math.random() * 3,
          image: randomMineral.image,
          value: randomMineral.value,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnMineral, 500);

    return () => clearInterval(interval);
  }, [spawnMineral]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        minerals.forEach((mineral) => {
          const img = new Image();
          img.src = mineral.image;

          ctx.drawImage(img, mineral.x, mineral.y, mineral.radius * 2, mineral.radius * 2);
        });

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, [minerals]);

  return <canvas ref={canvasRef} width={800} height={600} style={{ backgroundColor: 'black' }} />;
};

export default GameCanvas;
