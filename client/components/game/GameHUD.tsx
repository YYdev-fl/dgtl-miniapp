import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { IBoostCard } from "../../models/Boosts"

interface GameHUDProps {
  score: number;
  timeLeft: number;
}

interface IUserBoosts {
  [key: string]: number;
}

const GameHUD: React.FC<GameHUDProps> = ({ score, timeLeft }) => {
  const { data: session } = useSession();
  const [boostCards, setBoostCards] = useState<IBoostCard[]>([]);
  const [userBoosts, setUserBoosts] = useState<IUserBoosts>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch boost cards
        const boostsResponse = await axios.get("/api/boost-cards");
        setBoostCards(boostsResponse.data);

        // Fetch user boosts
        if (session) {
          const userResponse = await axios.get("/api/user/data");
          setUserBoosts(userResponse.data.boosts || {});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [session]);

  // Filter boosts that are available and owned by the user
  const activeBoosts = boostCards
    .filter((boost) => userBoosts[boost.id] > 0)
    .map((boost) => ({
      ...boost,
      quantity: userBoosts[boost.id],
    }));

    return (
      <>
        {/* Score and Time */}
        <h1 className="absolute top-4 left-4 text-2xl z-20 pointer-events-none">
          Score: {score}
        </h1>
        <h2 className="absolute top-4 right-4 text-2xl z-20 pointer-events-none">
          Time Left: {timeLeft}s
        </h2>
  
        {/* Boosts Display */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
          {activeBoosts.map((boost) => (
            <div
              key={boost.id}
              className="relative w-16 h-16"
              style={{ position: "relative", width: "64px", height: "64px" }}
            >
              <img
                src={boost.imageUrl}
                alt={`Boost ${boost.id}`}
                className="w-full h-full object-contain rounded-xl"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
              <span
                className="absolute bottom-0 left-0 text-white bg-black bg-gradient-to-t from-black to-transparent text-xs font-bold px-1 py-0.5 rounded-tl-lg"
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  padding: "2px 4px",
                  borderRadius: "4px 0 0 0",
                }}
              >
                x{boost.quantity}
              </span>
            </div>
          ))}
        </div>
      </>
    );
  };

export default GameHUD;