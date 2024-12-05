import { useState, useEffect } from 'react';
import { mineralsData } from '../constants/gameData';
import { preloadImage } from '../lib/preloadImage';
import { preloadVideo } from '../lib/preloadVideo';

export function usePreloadAssets() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAssets() {
      try {
        const imagePromises = mineralsData.map((m) => preloadImage(m.image));
        await Promise.all([
          ...imagePromises,
          preloadVideo("/game/bg/123.mp4")
        ]);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load assets:", err);
      }
    }
    loadAssets();
  }, []);

  return isLoading;
}
