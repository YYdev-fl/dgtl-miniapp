import React, { useState, useCallback } from 'react';
import GameHUD from '../components/game/GameHUD';
import GameOverModal from '../components/game/GameOverModal';
import GameCanvas from '../components/game/GameCanvas';

const GamePage: React.FC = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [collectedMinerals, setCollectedMinerals] = useState<Record<string, { count: number; value: number }>>({});

  const handleMineralClick = useCallback((id: number, value: number, image: string) => {
    setScore((prevScore) => prevScore + value);
    setCollectedMinerals((prev) => ({
      ...prev,
      [image]: {
        count: (prev[image]?.count || 0) + 1,
        value,
      },
    }));
  }, []);

  const handleGoToMainMenu = () => {
    // Logic to navigate to the main menu
  };

  return (
    <div className="relative w-screen h-screen">
      <GameCanvas
        onMineralClick={handleMineralClick}
        isGameOver={isGameOver}
        setIsGameOver={setIsGameOver}
        setCollectedMinerals={setCollectedMinerals}
      />
      <GameHUD score={score} timeLeft={timeLeft} />
      {isGameOver && (
        <GameOverModal
          totalCollectedValue={score}
          collectedMinerals={collectedMinerals}
          onGoToMainMenu={handleGoToMainMenu}
        />
      )}
    </div>
  );
};

export default GamePage;
