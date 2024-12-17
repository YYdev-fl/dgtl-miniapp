import { useEffect, useRef, useState } from "react";
import { Game } from "../game/gameLogic";
import GameHUD from "../components/game/GameHUD"; // Adjust the import path as needed
import { GAME_DURATION } from "../game/constants/gameData";

const GamePage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const game = new Game(canvas, {
                onScoreUpdate: (newScore) => setScore(newScore),
                onTimeLeftUpdate: (newTime) => setTimeLeft(newTime),
            });
            game.startGame();
        }

        return () => {
            const context = canvasRef.current?.getContext("2d");
            if (context && canvasRef.current) {
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        };
    }, []);

    return (
        <div className="w-full h-screen overflow-hidden touch-none relative">
            <canvas ref={canvasRef} className="block w-full h-full"></canvas>
            {/* Overlay the GameHUD on top of the canvas */}
            <GameHUD score={score} timeLeft={timeLeft} />
        </div>
    );
};

export default GamePage;
