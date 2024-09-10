import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";

interface Circle {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
}

const Game: React.FC = () => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const circleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Function to add a new circle with random speed and position
  const addCircle = useCallback(() => {
    if (!isGameOver) {
      const gameAreaWidth = gameAreaRef.current?.clientWidth || 0;
      const id = Math.random();
      setCircles((prev) => [
        ...prev,
        {
          id,
          x: Math.random() * (gameAreaWidth - 48),
          y: -24,
          radius: 15 + Math.random() * 10,
          speed: 1 + Math.random() * 1.5,
        },
      ]);
    }
  }, [isGameOver]);

  // Update the positions of the circles
  const updateCircles = useCallback(() => {
    setCircles((prevCircles) =>
      prevCircles
        .map((circle) => ({
          ...circle,
          y: circle.y + circle.speed,
        }))
        .filter(
          (circle) =>
            circle.y - circle.radius < (gameAreaRef.current?.clientHeight || 0)
        )
    );

    if (!isGameOver) {
      animationFrameRef.current = requestAnimationFrame(updateCircles);
    }
  }, [isGameOver]);

  // Initialize the animation frame
  useEffect(() => {
    if (!isGameOver) {
      animationFrameRef.current = requestAnimationFrame(updateCircles);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGameOver, updateCircles]);

  // Interval to add circles
  useEffect(() => {
    circleIntervalRef.current = setInterval(addCircle, 300);

    return () => {
      if (circleIntervalRef.current) {
        clearInterval(circleIntervalRef.current);
      }
    };
  }, [addCircle]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      if (circleIntervalRef.current) {
        clearInterval(circleIntervalRef.current);
      }
    }
  }, [timeLeft, isGameOver]);

  // Handle circle click to remove it and increase score
  const handleCircleClick = useCallback((id: number) => {
    // Hide the clicked circle immediately
    const circleElement = document.getElementById(`circle-${id}`);
    if (circleElement) {
      circleElement.style.display = "none"; // Instantly hide the circle
    }

    // Update state to remove the circle
    setCircles((prevCircles) => prevCircles.filter((circle) => circle.id !== id));
    setScore((prevScore) => prevScore + 1);
  }, []);

  // Handle the end of the game and navigate back to index
  const handleGameEnd = () => {
    router.push("/"); // Navigate back to the index page
  };

  return (
    <div className="card bg-neutral text-white overflow-hidden fixed inset-0 w-full h-full">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/game/bg/123.mp4" // Adjust this path as necessary
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

        {/* Render Circles */}
        {circles.map((circle) => (
          <div
            key={circle.id}
            id={`circle-${circle.id}`} // Unique ID for immediate handling
            onClick={() => handleCircleClick(circle.id)} // Use onClick for better touch response
            style={{
              position: "absolute",
              left: circle.x - 5,
              top: circle.y - 5,
              width: circle.radius * 2 + 10,
              height: circle.radius * 2 + 10,
              cursor: "pointer",
              transition: "transform 0.1s",
              pointerEvents: "auto",
              touchAction: "manipulation", // Prevent touch delay on mobile
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "5px",
                top: "5px",
                width: circle.radius * 2,
                height: circle.radius * 2,
                borderRadius: "50%",
                backgroundColor: "red",
              }}
            />
          </div>
        ))}
      </div>

      {/* Game Over Popup */}
      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
          <div className="bg-white text-black p-8 rounded shadow-lg">
            <h2 className="text-2xl mb-4">Game Over!</h2>
            <p className="mb-4">You scored: {score} points</p>
            <button
              onClick={handleGameEnd} // Go back to index page
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
