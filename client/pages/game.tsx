import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";

// Define mineral interface
interface Mineral {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number; // Pixels per second
  rotationSpeed: number;
  rotation: number;
  image: string;
  value: number; // Value in coins
}

// Define each mineral's data with its image, value, and rotation speed
const mineralsData = [
  { image: "/minerals/1.png", value: 1, rotationSpeed: 1 },
  { image: "/minerals/2.png", value: 2, rotationSpeed: 1.5 },
  { image: "/minerals/3.png", value: 3, rotationSpeed: 2 },
  { image: "/minerals/au.png", value: 4, rotationSpeed: 2.5 },
];

const Game: React.FC = () => {
  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const [collectedMinerals, setCollectedMinerals] = useState<Record<string, { count: number; value: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mineralIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);
  const router = useRouter();

  // Preload images and video for the game
  const preloadImage = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => reject();
    });
  };

  const preloadVideo = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const video = document.createElement("video");
      video.src = src;
      video.oncanplaythrough = () => resolve();
      video.onerror = () => reject();
      video.load();
    });
  };

  // Preload all game assets
  const preloadAssets = async () => {
    try {
      const imagePromises = mineralsData.map((mineral) => preloadImage(mineral.image));
      await Promise.all([...imagePromises, preloadVideo("/game/bg/123.mp4")]);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load assets:", error);
    }
  };

  // Add a new mineral to the game area
  const addMineral = useCallback(async () => {
    if (!isGameOver) {
      const gameAreaWidth = gameAreaRef.current?.clientWidth || 0;
      const id = Math.random();
      const randomMineral = mineralsData[Math.floor(Math.random() * mineralsData.length)];

      try {
        await preloadImage(randomMineral.image);

        setMinerals((prev) => [
          ...prev,
          {
            id,
            x: Math.random() * (gameAreaWidth - 48),
            y: -24,
            radius: 15 + Math.random() * 10,
            speed: 100 + Math.random() * 50, // Speed in pixels per second
            rotationSpeed: randomMineral.rotationSpeed,
            rotation: 0,
            image: randomMineral.image,
            value: randomMineral.value,
          },
        ]);
      } catch (error) {
        console.error("Failed to load image:", randomMineral.image);
      }
    }
  }, [isGameOver]);

  // Update the position and rotation of minerals
  const updateMinerals = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setMinerals((prevMinerals) =>
        prevMinerals
          .map((mineral) => ({
            ...mineral,
            y: mineral.y + mineral.speed * deltaTime,
            rotation: mineral.rotation + mineral.rotationSpeed * deltaTime * 60,
          }))
          .filter(
            (mineral) =>
              mineral.y - mineral.radius < (gameAreaRef.current?.clientHeight || 0)
          )
      );

      if (!isGameOver) {
        animationFrameRef.current = requestAnimationFrame(updateMinerals);
      }
    },
    [isGameOver]
  );

  // Initialize the animation
  useEffect(() => {
    if (!isGameOver) {
      animationFrameRef.current = requestAnimationFrame(updateMinerals);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGameOver, updateMinerals]);

  // Interval to add minerals
  useEffect(() => {
    mineralIntervalRef.current = setInterval(addMineral, 300);

    return () => {
      if (mineralIntervalRef.current) {
        clearInterval(mineralIntervalRef.current);
      }
    };
  }, [addMineral]);

  // Countdown timer for the game
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      if (mineralIntervalRef.current) {
        clearInterval(mineralIntervalRef.current);
      }
    }
  }, [timeLeft, isGameOver]);

  // Handle mineral click
  const handleMineralClick = useCallback((id: number, value: number, image: string) => {
    setMinerals((prevMinerals) => prevMinerals.filter((mineral) => mineral.id !== id));
    setScore((prevScore) => prevScore + value);
    setCollectedMinerals((prev) => ({
      ...prev,
      [image]: {
        count: (prev[image]?.count || 0) + 1,
        value,
      },
    }));
  }, []);

  // Handle the end of the game and navigate back to the index
  const handleGameEnd = () => {
    router.push("/");
  };

  // Load assets when the component mounts
  useEffect(() => {
    preloadAssets();
  }, []);

  // Display loading screen while assets are loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <div className="loading loading-spinner loading-lg mb-4"></div>
      </div>
    );
  }

  // Calculate total collected minerals value
  const totalCollectedValue = Object.values(collectedMinerals).reduce(
    (acc, mineral) => acc + mineral.count * mineral.value,
    0
  );

  return (
    <div className="card bg-neutral text-white overflow-hidden fixed inset-0 w-full h-full">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/game/bg/123.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Game Area with Padding Inside */}
      <div
        ref={gameAreaRef}
        className="relative z-10 w-full h-full bg-base-100 bg-opacity-50 overflow-hidden select-none p-3 box-border"
        style={{ userSelect: "none" }}
      >
        {/* Score Display */}
        <h1 className="absolute top-4 left-4 text-2xl z-20 pointer-events-none">
          Score: {score}
        </h1>

        {/* Timer Display */}
        <h2 className="absolute top-4 right-4 text-2xl z-20 pointer-events-none">
          Time Left: {timeLeft}s
        </h2>

        {/* Render Minerals */}
        {minerals.map((mineral) => (
          <div
            key={mineral.id}
            id={`mineral-${mineral.id}`}
            onClick={() =>
              handleMineralClick(mineral.id, mineral.value, mineral.image)
            }
            style={{
              position: "absolute",
              left: mineral.x - 20,
              top: mineral.y - 5,
              width: mineral.radius * 2 + 15,
              height: mineral.radius * 2 + 15,
              cursor: "pointer",
              transform: `rotate(${mineral.rotation}deg)`,
              transition: "transform 0.1s",
              pointerEvents: "auto",
              touchAction: "manipulation",
            }}
          >
            <img
              src={mineral.image}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-30 p-6">
          <h1 className="text-3xl mb-4">Game Over!</h1>
          <p className="mb-6">Total Score: {score} Coins</p>

          {/* Display Collected Minerals */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(collectedMinerals).map(([image, { count, value }]) => (
              <div key={image} className="flex items-center">
                <img src={image} alt="" className="w-12 h-12 mr-4" />
                <div>
                  <p>Collected: {count}</p>
                  <p>Value: {value} Coins</p>
                  <p>Total: {count * value} Coins</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mb-6 text-lg">Total Collected Value: {totalCollectedValue} Coins</p>

          <button className="btn btn-primary" onClick={handleGameEnd}>
            Go to Main Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
