import { useEffect, useRef } from "react";
import { Game } from "../game/gameLogic";

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {

    document.body.style.overflow = "hidden";

    const canvas = canvasRef.current;

    if (canvas) {
      

      const game = new Game(canvas);
      game.startGame();
    }

    return () => {
      // Perform cleanup if necessary
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden touch-none">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      ></canvas>
    </div>
  );
};

export default GamePage;
