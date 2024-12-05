import React from 'react';

interface GameHUDProps {
  score: number;
  timeLeft: number;
}

const GameHUD: React.FC<GameHUDProps> = ({ score, timeLeft }) => (
  <>
    <h1 className="absolute top-4 left-4 text-2xl z-20 pointer-events-none">
      Score: {score}
    </h1>
    <h2 className="absolute top-4 right-4 text-2xl z-20 pointer-events-none">
      Time Left: {timeLeft}s
    </h2>
  </>
);

export default GameHUD;
