// pages/game.tsx

import React, { useCallback } from 'react';
import { usePreloadAssets } from '../hooks/usePreloadAssets';
import { useGameLogic } from '../hooks/useGameLogic';

import BackgroundVideo from '../components/game/BackgroundVideo';
import GameHUD from '../components/game/GameHUD';
import CanvasGame from '../components/game/CanvasGame';
import GameOverModal from '../components/game/GameOverModal';

const GamePage: React.FC = () => {
  const isLoading = usePreloadAssets();
  const {
    minerals,
    score,
    timeLeft,
    isGameOver,
    totalCollectedValue,
    collectedMinerals,
    handleMineralClick,
    goToMainMenu
  } = useGameLogic();

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const canvas = event.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Find if a mineral was clicked
      minerals.forEach((mineral) => {
        const distance = Math.hypot(mineral.x - clickX, mineral.y - clickY);
        if (distance < mineral.radius) {
          handleMineralClick(mineral.id, mineral.value, mineral.image);
        }
      });
    },
    [minerals, handleMineralClick]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <div className="loading loading-spinner loading-lg mb-4"></div>
      </div>
    );
  }

  return (
    <div className="card bg-neutral text-white overflow-hidden fixed inset-0 w-full h-full select-none touch-none">
      <BackgroundVideo src="/game/bg/123.mp4" />
      <CanvasGame
        minerals={minerals}
        handleMineralClick={handleMineralClick}
        isGameOver={isGameOver}
        onClick={handleCanvasClick} // Pass the click handler here
      />
      <div className="relative z-10 w-full h-full bg-base-100 bg-opacity-50 overflow-hidden p-3 box-border">
        <GameHUD score={score} timeLeft={timeLeft} />
      </div>
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
