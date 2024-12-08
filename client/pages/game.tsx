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

  // Preload images for minerals
  const [preloadedImages, setPreloadedImages] = useState<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, HTMLImageElement> = {};
      for (const mineral of minerals) {
        if (!images[mineral.image]) {
          const img = new Image();
          img.src = mineral.image;
          await new Promise((resolve, reject) => {
            img.onload = () => resolve(null);
            img.onerror = () => reject(`Failed to load ${mineral.image}`);
          });
          console.log(`Loaded image: ${mineral.image}`);
          images[mineral.image] = img;
        }
      }
      setPreloadedImages(images);
    };

    loadImages();
  }, [minerals]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      setContext(ctx);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (!context) return;

    const draw = () => {
      const canvas = canvasRef.current!;
      const { width, height } = canvas;

      // Clear canvas
      context.clearRect(0, 0, width, height);

      // Draw background
      context.fillStyle = "#1e1e1e"; // Dark grey background
      context.fillRect(0, 0, width, height);

      // Draw minerals
      minerals.forEach((mineral) => {
        const img = preloadedImages[mineral.image];

        if (img) {
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
        } else {
          // Placeholder shape if image is not loaded
          console.warn(`Image not loaded: ${mineral.image}`);
          context.beginPath();
          context.arc(mineral.x, mineral.y, mineral.radius, 0, Math.PI * 2);
          context.fillStyle = "red";
          context.fill();
          context.closePath();
        }
      });

      if (!isGameOver) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  }, [context, minerals, isGameOver, preloadedImages]);

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
