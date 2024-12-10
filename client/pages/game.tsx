import { useEffect, useRef } from "react";
import { Game } from "../game/gameLogic";

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      // Initialize the Game instance
      

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
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }}></canvas>
    </div>
  );
};

export default GamePage;
