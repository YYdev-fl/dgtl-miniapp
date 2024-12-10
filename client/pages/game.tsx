import { useEffect, useRef } from "react";
import { Game } from "../game/gameLogic";

const GamePage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const game = new Game(canvas);
            game.startGame();
        }

        return () => {
            const context = canvasRef.current?.getContext("2d");
            if (context) context.clearRect(0, 0, canvas!.width, canvas!.height);
        };
    }, []);

    return (
        <div className="w-full h-screen overflow-hidden touch-none">
            <canvas ref={canvasRef} className="block w-full h-full"></canvas>
        </div>
    );
};

export default GamePage;
