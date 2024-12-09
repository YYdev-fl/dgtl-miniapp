import { useEffect, useRef, useState } from 'react';

type Mineral = {
  id: number;
  x: number;
  y: number;
  speed: number;
  rotationSpeed: number;
  rotation: number;
  value: number;
  radius: number;
};

const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tokens, setTokens] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Game time in seconds
  const [minerals, setMinerals] = useState<Mineral[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate minerals
    const generateMineral = () => {
      return {
        id: Math.random(),
        x: Math.random() * canvas.width,
        y: -50, // Start above the screen
        speed: Math.random() * 2 + 1, // Falling speed
        rotationSpeed: Math.random() * 2 - 1, // Rotation speed
        rotation: 0, // Initial rotation
        value: Math.floor(Math.random() * 10 + 1), // Coin value
        radius: 20 + Math.random() * 30, // Size of the mineral
      };
    };

    const spawnMinerals = setInterval(() => {
      setMinerals((prev) => [...prev, generateMineral()]);
    }, 1000);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Game loop
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw time and tokens
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.fillText(`Time Left: ${timeLeft}s`, 10, 30);
      ctx.fillText(`Tokens: ${tokens}`, canvas.width - 150, 30);

      // Update and draw minerals
      setMinerals((prev) =>
        prev
          .map((mineral) => {
            mineral.y += mineral.speed;
            mineral.rotation += mineral.rotationSpeed;
            return mineral;
          })
          .filter((mineral) => mineral.y - mineral.radius < canvas.height) // Remove minerals that fall off-screen
      );

      minerals.forEach((mineral) => {
        ctx.save();
        ctx.translate(mineral.x, mineral.y);
        ctx.rotate((mineral.rotation * Math.PI) / 180);

        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(0, 0, mineral.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(mineral.value.toString(), -5, 5);

        ctx.restore();
      });

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      clearInterval(spawnMinerals);
      clearInterval(timer);
    };
  }, [timeLeft, tokens, minerals]);

  // Handle clicks
  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setMinerals((prev) =>
      prev.filter((mineral) => {
        const distance = Math.sqrt(
          (mouseX - mineral.x) ** 2 + (mouseY - mineral.y) ** 2
        );

        if (distance < mineral.radius) {
          setTokens((prevTokens) => prevTokens + mineral.value);
          return false; // Remove clicked mineral
        }

        return true; // Keep mineral
      })
    );
  };

  return (
    <div>
      <canvas ref={canvasRef} onClick={handleClick} />
    </div>
  );
};

export default GamePage;
