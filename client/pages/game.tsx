import { useEffect, useRef, useState } from "react";
import { Game } from "../game/gameLogic";
import GameHUD from "../components/game/GameHUD";
import GameOverModal from "../components/game/GameOverModal";
import { GAME_DURATION, MINERALS } from "../game/constants/gameData";
import axios from "axios";
import { useSession } from "next-auth/react";
import { preloadImage } from "../lib/preloadImage";
// import { preloadVideo } from "../lib/preloadVideo"; 

interface IBoostCard {
  id: string;
  imageUrl: string;
}

interface IUserBoosts {
  [key: string]: number;
}

const GamePage: React.FC = () => {
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null); // Reference to the Game instance

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [totalCollectedValue, setTotalCollectedValue] = useState(0);
  const [collectedMinerals, setCollectedMinerals] = useState<Record<string, { count: number; value: number }>>({});
  const [boostCards, setBoostCards] = useState<IBoostCard[]>([]);
  const [userBoosts, setUserBoosts] = useState<IUserBoosts>({});

  const [cooldowns, setCooldowns] = useState<{ [key: string]: number | null }>({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isImagesLoading, setIsImagesLoading] = useState(true);

  // Fetching boosts and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const boostsResponse = await axios.get("/api/boost-cards");
        setBoostCards(boostsResponse.data);

        if (session) {
          const userResponse = await axios.get("/api/user/data");
          setUserBoosts(userResponse.data.boosts || {});
        }

        setIsDataLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, [session]);

  // Preload mineral images
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const imagePromises = MINERALS.map((m) => preloadImage(m.src));
        await Promise.all(imagePromises);
        setIsImagesLoading(false);
      } catch (err) {
        console.error("Failed to load assets:", err);
        setIsImagesLoading(false);
      }
    };
    preloadAssets();
  }, []);

  // Once both data and images are loaded, start the game
  useEffect(() => {
    if (!isDataLoading && !isImagesLoading && canvasRef.current) {
      const game = new Game(canvasRef.current, {
        onScoreUpdate: (newScore) => setScore(newScore),
        onTimeLeftUpdate: (newTime) => setTimeLeft(newTime),
        onGameOver: async (collectedValue, minerals) => {
          setTotalCollectedValue(collectedValue);
          setCollectedMinerals(minerals);
          setGameOver(true);
          try {
            await axios.post("/api/updateCoins", { amount: collectedValue });
          } catch (error) {
            console.error("Failed to update coins:", error);
          }
        },
      });

      game.startGame();
      gameRef.current = game; // Store the game instance in the ref
    }

    return () => {
      const context = canvasRef.current?.getContext("2d");
      if (context && canvasRef.current) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [isDataLoading, isImagesLoading]);

  const handleBoostClick = (boostId: string) => {
  const currentQuantity = userBoosts[boostId] || 0;

  if (cooldowns[boostId]) {
    console.log(`Boost ${boostId} is on cooldown.`);
    return; // Restrict clicking during cooldown
  }

  if (currentQuantity > 0) {
    // Decrement the boost from user's inventory
    setUserBoosts((prev) => ({
      ...prev,
      [boostId]: prev[boostId] - 1,
    }));

    // Apply effect in the game
    if (gameRef.current) {
      gameRef.current.useBoost(boostId);
    }

    // Start cooldown timer (3 seconds)
    setCooldowns((prev) => ({ ...prev, [boostId]: 5 }));

    const cooldownInterval = setInterval(() => {
      setCooldowns((prev) => {
        if (!prev[boostId]) return prev; // Exit if already cleared
        const newTime = prev[boostId]! - 1;
        if (newTime <= 0) {
          clearInterval(cooldownInterval);
          return { ...prev, [boostId]: null }; // Clear cooldown
        }
        return { ...prev, [boostId]: newTime };
      });
    }, 1000);
  } else {
    console.log("No boost of this type available.");
  }
};

  const handleGoToMainMenu = () => {
    window.location.href = "/";
  };

  // Compute active boosts after data is loaded
  const activeBoosts = boostCards
    .filter((boost) => userBoosts[boost.id] > 0)
    .map((boost) => ({
      ...boost,
      quantity: userBoosts[boost.id],
    }));

  const isLoading = isDataLoading || isImagesLoading;

  return (
    <div className="w-full h-screen overflow-hidden touch-none relative">
      <canvas ref={canvasRef} className="block w-full h-full"></canvas>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 z-50">
          <div className="loading loading-spinner loading-lg mb-4"></div>
        </div>
      )}

      {!isLoading && !gameOver && (
        <GameHUD
        score={score}
        timeLeft={timeLeft}
        boostCards={activeBoosts}
        onBoostClick={handleBoostClick}
        cooldowns={cooldowns}
      />
      )}

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
