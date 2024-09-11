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
  value: number;
}

// Mineral data with images, values, and rotation speed
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
  const [collectedMinerals, setCollectedMinerals] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mineralIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0); // Reference to store the last timestamp
  const router = useRouter();

  // Preload an image and return a promise that resolves when loaded
  const preloadImage = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => reject();
    });
  };

  // Preload background video by creating a video element
  const preloadVideo = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const video = document.createElement("video");
      video.src = src;
      video.oncanplaythrough = () => resolve();
      video.onerror = () => reject();
      video.load();
    });
  };

  // Function to preload all game assets
  const preloadAssets = async () => {
    try {
      // Preload all mineral images and background video
      const imagePromises = mineralsData.map((mineral) => preloadImage(mineral.image));
      await Promise.all([...imagePromises, preloadVideo("/game/bg/123.mp4")]);
      setIsLoading(false); // Set loading to false when all assets are loaded
    } catch (error) {
      console.error("Failed to load assets:", error);
    }
  };

  // Function to add a new mineral
  const addMineral = useCallback(async () => {
    if (!isGameOver) {
      const gameAreaWidth = gameAreaRef.current?.clientWidth || 0;
      const id = Math.random();
      const randomMineral = mineralsData[Math.floor(Math.random() * mineralsData.length)];

      try {
        // Preload the image before adding the mineral
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

  // Update the positions and rotations of the minerals with consistent speed
  const updateMinerals = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Calculate time difference in seconds
      lastTimeRef.current = timestamp;

      setMinerals((prevMinerals) =>
        prevMinerals
          .map((mineral) => ({
            ...mineral,
            y: mineral.y + mineral.speed * deltaTime, // Use deltaTime to normalize speed
            rotation: mineral.rotation + mineral.rotationSpeed * deltaTime * 60, // Adjust rotation speed consistently
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

  // Initialize the animation frame
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

  // Timer countdown
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

  // Handle mineral click to remove it and increase score
  const handleMineralClick = useCallback((id: number, value: number, image: string) => {
    setMinerals((prevMinerals) => prevMinerals.filter((mineral) => mineral.id !== id));
    setScore((prevScore) => prevScore + value);
    setCollectedMinerals((prev) => ({
      ...prev,
      [image]: (prev[image] || 0) + 1,
    }));
  }, []);

  // Handle the end of the game and navigate back to index
  const handleGameEnd = () => {
    router.push("/");
  };

  // Load all assets on component mount
  useEffect(() => {
    preloadAssets();
  }, []);

  // Render loading screen if still loading assets
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
        </div>
      </div>
    );
  }

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
            onClick={() => handleMineralClick(mineral.id, mineral.value, mineral.image)}
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
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-30">
          <h1 className="text-3xl mb-4">Game Over!</h1>
          <p className="mb-6">Score: {score}</p>
          <button className="btn btn-primary" onClick={handleGameEnd}>
            Go to Main Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
