import React, { useRef, useEffect, useState } from "react";
import { usePreloadAssets } from "../hooks/usePreloadAssets";
import { useGameLogic } from "../hooks/useGameLogic";

import GameHUD from "../components/game/GameHUD";
import GameOverModal from "../components/game/GameOverModal";

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLoading = usePreloadAssets();
  const {
    minerals,
    score,
    timeLeft,
    isGameOver,
    totalCollectedValue,
    collectedMinerals,
    handleMineralClick,
    goToMainMenu,
  } = useGameLogic();

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      setContext(ctx);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (!context) return;

    const draw = () => {
      // Clear canvas
      context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

      // Draw background
      context.fillStyle = "black";
      context.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

      // Draw minerals
      minerals.forEach((mineral) => {
        const img = new Image();
        img.src = mineral.image;
        img.onload = () => {
          context.save();
          context.translate(mineral.x, mineral.y);
          context.rotate((mineral.rotation * Math.PI) / 180);
          context.drawImage(
            img,
            -mineral.radius,
            -mineral.radius,
            mineral.radius * 2,
            mineral.radius * 2
          );
          context.restore();
        };
      });

      if (!isGameOver) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  }, [context, minerals, isGameOver]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    minerals.forEach((mineral) => {
      const dx = x - mineral.x;
      const dy = y - mineral.y;
      if (Math.sqrt(dx * dx + dy * dy) <= mineral.radius) {
        handleMineralClick(mineral.id, mineral.value, mineral.image);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <div className="loading loading-spinner loading-lg mb-4"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Canvas for Game Rendering */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
        className="absolute inset-0"
      />

      {/* Reusing GameHUD for Score, Time, and Boosts */}
      <GameHUD score={score} timeLeft={timeLeft} />

      {/* Game Over Modal */}
      {isGameOver && (
        <GameOverModal
          totalCollectedValue={totalCollectedValue}
          collectedMinerals={collectedMinerals}
          onGoToMainMenu={goToMainMenu}
        />
      )}
    </div>
  );
};

export default GamePage;
