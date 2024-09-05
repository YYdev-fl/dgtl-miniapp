import React, { useEffect, useRef, useState } from "react";

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
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Function to add a new circle with random speed and position
  const addCircle = () => {
    const gameAreaWidth = gameAreaRef.current?.clientWidth || 0;
    const id = Math.random();
    setCircles((prev) => [
      ...prev,
      {
        id,
        x: Math.random() * (gameAreaWidth - 48), // Random X position based on game area width
        y: -24, // Start above the screen
        radius: 8 + Math.random() * 16, // Random radius between 8 and 24
        speed: 1 + Math.random() * 3, // Random speed between 1 and 4
      },
    ]);
  };

  // Update the positions of the circles
  const updateCircles = () => {
    setCircles((prevCircles) =>
      prevCircles
        .map((circle) => ({
          ...circle,
          y: circle.y + circle.speed, // Move the circle down by its speed
        }))
        .filter(
          (circle) =>
            circle.y - circle.radius < (gameAreaRef.current?.clientHeight || 0) // Filter out circles that are off the screen
        )
    );
    // Request the next animation frame
    animationFrameRef.current = requestAnimationFrame(updateCircles);
  };

  // Initialize the animation frame
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateCircles);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Interval to add circles
  useEffect(() => {
    const circleInterval = setInterval(addCircle, 1000);

    return () => clearInterval(circleInterval);
  }, []);

  // Handle circle click to remove it and increase score
  const handleCircleClick = (id: number) => {
    setCircles((prevCircles) =>
      prevCircles.filter((circle) => circle.id !== id)
    );
    setScore((prevScore) => prevScore + 1);
  };

  return (
    <div className="card bg-neutral text-white overflow-hidden relative w-full h-full min-h-screen">
        {/* Padding Wrapper */}
        <div className="absolute inset-0 p-3 box-border">
            {/* Game Area */}
            <div
            ref={gameAreaRef}
            className="w-full h-full bg-gray-800 overflow-hidden relative"
            >
            {/* Score Display */}
            <h1 className="absolute top-4 left-4 text-2xl z-20">Score: {score}</h1>
            
            {/* Render Circles */}
            {circles.map((circle) => (
                <div
                key={circle.id}
                onClick={() => handleCircleClick(circle.id)}
                style={{
                    position: "absolute",
                    left: circle.x,
                    top: circle.y,
                    width: circle.radius * 2,
                    height: circle.radius * 2,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    cursor: "pointer",
                    transition: "transform 0.1s",
                }}
                />
            ))}
            </div>
        </div>
    </div>


  );
};

export default Game;
