import { useEffect, useRef, useState } from "react";
import { Game } from "../game/gameLogic";
import GameHUD from "../components/game/GameHUD";
import GameOverModal from "../components/game/GameOverModal";
import { GAME_DURATION, MINERALS } from "../game/constants/gameData";
import axios from "axios";
import { useSession } from "next-auth/react";
import { preloadImage } from "../lib/preloadImage";

interface BoostCard {
  id: string;
  imageUrl: string;
}

interface UserBoosts {
  [key: string]: number;
}

const BOOST_COOLDOWN_DURATION = 5; // Cooldown in seconds

const GamePage: React.FC = () => {
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [totalCollectedValue, setTotalCollectedValue] = useState(0);
  const [collectedMinerals, setCollectedMinerals] = useState<
    Record<string, { count: number; value: number }>
  >({});

  const [boostCards, setBoostCards] = useState<BoostCard[]>([]);
  const [userBoosts, setUserBoosts] = useState<UserBoosts>({});
  const [cooldowns, setCooldowns] = useState<{ [key: string]: number | null }>({});

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isImagesLoading, setIsImagesLoading] = useState(true);

  /**
   * Fetch data for boosts and user. 
   * Extracting this logic makes it easier to modify in the future.
   */
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

  /**
   * Preload all mineral images before starting the game.
   * Keeping asset loading separate makes it easy to add more preloads later.
   */
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

  /**
   * Initializes and starts the game once all data and images are loaded.
   */
  useEffect(() => {
    if (!isDataLoading && !isImagesLoading && canvasRef.current) {
      initializeGame();
    }

    // Cleanup rendering context on component unmount or dependency changes
    return () => {
      const context = canvasRef.current?.getContext("2d");
      if (context && canvasRef.current) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [isDataLoading, isImagesLoading]);

  /**
   * A dedicated function to initialize the game.
   * Keeps the useEffect tidy and focused on lifecycle management.
   */
  const initializeGame = () => {
    if (!canvasRef.current) return;
    const game = new Game(canvasRef.current, {
      onScoreUpdate: (newScore) => setScore(newScore),
      onTimeLeftUpdate: (newTime) => setTimeLeft(newTime),
      onGameOver: handleGameOver,
    });

    game.startGame();
    gameRef.current = game;
  };

  /**
   * Handler for when the game is over.
   * Separated for clarity and reusability.
   */
  const handleGameOver = async (collectedValue: number, minerals: Record<string, { count: number; value: number }>) => {
    setTotalCollectedValue(collectedValue);
    setCollectedMinerals(minerals);
    setGameOver(true);

    try {
      await axios.post("/api/updateCoins", { amount: collectedValue });
    } catch (error) {
      console.error("Failed to update coins:", error);
    }
  };

  /**
   * Handles a click on a boost card. 
   * Checks availability, handles cooldown, and applies the boost to the game.
   */
  const handleBoostClick = (boostId: string) => {
    const currentQuantity = userBoosts[boostId] || 0;

    if (cooldowns[boostId]) {
      console.log(`Boost ${boostId} is on cooldown.`);
      return;
    }

    if (currentQuantity > 0) {
      // Decrement boost count in user's inventory
      setUserBoosts((prev) => ({
        ...prev,
        [boostId]: prev[boostId] - 1,
      }));

      // Apply effect in the game
      if (gameRef.current) {
        gameRef.current.useBoost(boostId);
      }

      // Start the cooldown for this boost
      startBoostCooldown(boostId, BOOST_COOLDOWN_DURATION);
    } else {
      console.log("No boost of this type available.");
    }
  };

  /**
   * Starts a cooldown for a given boost.
   * Encapsulating this logic lets us easily change the cooldown duration logic if needed.
   */
  const startBoostCooldown = (boostId: string, duration: number) => {
    setCooldowns((prev) => ({ ...prev, [boostId]: duration }));

    const cooldownInterval = setInterval(() => {
      setCooldowns((prev) => {
        const currentTime = prev[boostId];
        if (!currentTime) {
          clearInterval(cooldownInterval);
          return prev;
        }

        const newTime = currentTime - 1;
        if (newTime <= 0) {
          clearInterval(cooldownInterval);
          return { ...prev, [boostId]: null };
        }

        return { ...prev, [boostId]: newTime };
      });
    }, 1000);
  };

  const handleGoToMainMenu = () => {
    window.location.href = "/";
  };

  // Compute active boosts to display in the HUD
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
