import { useEffect, useRef, useState } from "react";
import { Game } from "../game/gameLogic";
import GameHUD from "../components/game/GameHUD";
import GameOverModal from "../components/game/GameOverModal"; 
import { GAME_DURATION } from "../game/constants/gameData";
import axios from "axios";
import router from "next/router";

const GamePage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameOver, setGameOver] = useState(false);
    const [totalCollectedValue, setTotalCollectedValue] = useState(0);
    const [collectedMinerals, setCollectedMinerals] = useState<Record<string, { count: number; value: number }>>({});

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const game = new Game(canvas, {
                onScoreUpdate: (newScore) => setScore(newScore),
                onTimeLeftUpdate: (newTime) => setTimeLeft(newTime),
                onGameOver: async (collectedValue, minerals) => {
                    setTotalCollectedValue(collectedValue);
                    setCollectedMinerals(minerals);
                    setGameOver(true);
                    // Update coins in DB
                    try {
                        await axios.post("/api/updatecoins", { amount: collectedValue });
                    } catch (error) {
                        console.error("Failed to update coins:", error);
                    }
                },
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

    const handleGoToMainMenu = () => {
        router.push("/");
    };

    return (
        <div className="w-full h-screen overflow-hidden touch-none relative">
            <canvas ref={canvasRef} className="block w-full h-full"></canvas>
            {!gameOver && <GameHUD score={score} timeLeft={timeLeft} />}
            {gameOver && (
                <GameOverModal
                    totalCollectedValue={totalCollectedValue}
                    collectedMinerals={collectedMinerals}
                    onGoToMainMenu={handleGoToMainMenu}
                />
            )}
        </div>
    );
};

export default GamePage;
