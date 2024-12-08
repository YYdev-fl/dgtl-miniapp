import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { mineralsData } from '../constants/gameData';
import { preloadImage } from '../lib/preloadImage';
import { Mineral } from '../models/Mineral';

export function useGameLogic() {
  const router = useRouter();

  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const [collectedMinerals, setCollectedMinerals] = useState<Record<string, { count: number; value: number }>>({});

  const animationFrameRef = useRef<number | null>(null);
  const mineralIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);

  const totalCollectedValue = Object.values(collectedMinerals).reduce(
    (acc, mineral) => acc + mineral.count * mineral.value,
    0
  );

  const addMineral = useCallback(async () => {
    if (isGameOver) return;
    const gameAreaWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
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
          speed: 100 + Math.random() * 50,
          rotationSpeed: randomMineral.rotationSpeed,
          rotation: 0,
          image: randomMineral.image,
          value: randomMineral.value,
        },
      ]);
    } catch (error) {
      console.error("Failed to load image:", randomMineral.image);
    }
  }, [isGameOver]);

  const updateMinerals = useCallback((deltaTime: number) => {
    setMinerals((prev) =>
      prev
        .map((m) => ({
          ...m,
          y: m.y + m.speed * deltaTime,
          rotation: m.rotation + m.rotationSpeed * deltaTime * 60,
        }))
        .filter((m) => m.y - m.radius < window.innerHeight)
    );

    // Check for game over condition if needed
  }, []);

  useEffect(() => {
    mineralIntervalRef.current = setInterval(addMineral, 300);
    return () => {
      if (mineralIntervalRef.current) {
        clearInterval(mineralIntervalRef.current);
      }
    };
  }, [addMineral]);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => {
        clearInterval(timer);
      };
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      if (mineralIntervalRef.current) clearInterval(mineralIntervalRef.current);
    }
  }, [timeLeft, isGameOver]);

  // Handle game loop
  useEffect(() => {
    if (isGameOver) return;

    let lastTimestamp = performance.now();

    const gameLoop = (timestamp: number) => {
      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      updateMinerals(deltaTime);

      if (!isGameOver) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGameOver, updateMinerals]);

  const handleMineralClick = useCallback((id: number, value: number, image: string) => {
    if (window.Telegram?.WebApp?.hapticFeedback) {
      window.Telegram.WebApp.hapticFeedback.impactOccurred('medium');
    }

    setMinerals((prev) => prev.filter((m) => m.id !== id));
    setScore((prevScore) => prevScore + value);
    setCollectedMinerals((prev) => ({
      ...prev,
      [image]: {
        count: (prev[image]?.count || 0) + 1,
        value,
      },
    }));
  }, []);

  useEffect(() => {
    if (isGameOver) {
      (async () => {
        try {
          const response = await fetch('/api/updateCoins', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalCollectedValue }),
          });
          const data = await response.json();
          if (!response.ok) {
            console.error('Error updating coins:', data.error || data.message);
          } else {
            console.log('Coins updated:', data.coins);
          }
        } catch (error) {
          console.error('Error updating coins:', error);
        }
      })();
    }
  }, [isGameOver, totalCollectedValue]);

  const goToMainMenu = useCallback(() => {
    router.push('/');
  }, [router]);

  return {
    minerals,
    score,
    timeLeft,
    isGameOver,
    totalCollectedValue,
    collectedMinerals,
    handleMineralClick,
    goToMainMenu,
  };
}
