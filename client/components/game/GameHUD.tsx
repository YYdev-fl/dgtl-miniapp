import React from "react";

interface IActiveBoost {
  id: string;
  imageUrl: string;
  quantity: number;
}

interface GameHUDProps {
  score: number;
  timeLeft: number;
  boostCards: IActiveBoost[];
}

const GameHUD: React.FC<GameHUDProps> = ({ score, timeLeft, boostCards }) => {
  return (
    <>
      <h1 className="absolute top-4 left-4 text-2xl z-20 pointer-events-none">
        Score: {score}
      </h1>
      <h2 className="absolute top-4 right-4 text-2xl z-20 pointer-events-none">
        Time Left: {timeLeft}s
      </h2>

      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        {boostCards.map((boost) => (
          <div
            key={boost.id}
            className="relative w-16 h-16"
            style={{ position: "relative", width: "64px", height: "64px" }}
          >
            <img
              src={boost.imageUrl}
              alt={`Boost ${boost.id}`}
              className="w-full h-full object-contain rounded-xl"
            />
            <span
              className="absolute bottom-1.5 left-1.5 text-white text-xs font-bold"
            >
              x{boost.quantity}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default GameHUD;