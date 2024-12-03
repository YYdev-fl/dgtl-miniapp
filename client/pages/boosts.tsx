import Layout from "../components/layout";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

// Define the type for each card's data
interface CardData {
  title: string;
  price: string;
  imageUrl: string; // Placeholder for image URL
  owned: number; // Number of cards owned by the user
}

interface MineralData {
  imageUrl: string; // Placeholder for image URL
  owned: number; // Number of cards owned by the user
}

// Sample data for the cards
const cards: CardData[] = [
  {
    title: "Speed Boost",
    price: "100",
    imageUrl: "/boosts/boost.png", // Update with your image path
    owned: 0,
  },
  {
    title: "Dynamite",
    price: "200",
    imageUrl: "/boosts/dynamite.png", // Update with your image path
    owned: 1,
  },
  {
    title: "Resource Multiplier",
    price: "200",
    imageUrl: "/boosts/x2.png", // Update with your image path
    owned: 0,
  },
  {
    title: "Big foot",
    price: "100",
    imageUrl: "/path-to-image/protection-shield.png", // Update with your image path
    owned: 0,
  },

];

const minerals: MineralData[] = [
  {
    imageUrl: "/mineral/c.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/au.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/as.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/ba.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/br.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/ca.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/cs.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/fe.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/mn-1.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/p.png", // Placeholder for image URL
    owned: 1,
  },{
    imageUrl: "/mineral/pd.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/rh.png", // Placeholder for image URL
    owned: 1,
  },{
    imageUrl: "/mineral/sb.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/sn.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/ti.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/u.png", // Placeholder for image URL
    owned: 1,
  },
  {
    imageUrl: "/mineral/zr.png", // Placeholder for image URL
    owned: 1,
  }
];

const Index: React.FC = () => {
  const { data: session } = useSession();
  const [boosts, setBoosts] = useState(
    cards.map((card) => ({ title: card.title, owned: card.owned }))
  );
  const [coins, setCoins] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleBuyBoost = async (boostType: string) => {
    if (!session) {
      alert("Please log in to buy boosts.");
      return;
    }

    try {
      const response = await axios.post("/api/buyboost", { boostType });
      const { boosts: updatedBoosts, coins: updatedCoins } = response.data;

      setBoosts((prevBoosts) =>
        prevBoosts.map((boost) =>
          boost.title === boostType
            ? { ...boost, owned: updatedBoosts[boostType] }
            : boost
        )
      );
      setCoins(updatedCoins);
      setMessage("Boost purchased successfully!");
    } catch (error: any) {
      if (error.response?.data?.message === "Not enough coins") {
        setMessage("You don't have enough coins to buy this boost.");
      } else {
        setMessage("Failed to purchase boost. Please try again later.");
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-20">
        <div className="text-center p-5">
          <h1 className="text-3xl font-bold p-2">🚀 Store</h1>
          <p className="p-2">Purchase utilities to accelerate your mineral mining speed!</p>
          {coins !== null && <p>Your Coins: {coins}</p>}
          {message && <p className="text-red-500 mt-2">{message}</p>}
        </div>

        <div className="card bg-neutral text-white p-5 shadow-lg m-3 shadow-md">
          <h2 className="card-title text-center mb-4">Boost Cards</h2>
          <div className="flex flex-col gap-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex items-center bg-secondary text-white p-4 rounded-xl"
              >
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-20 h-20 object-contain mr-4 rounded-xl"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-lg">{card.title}</h3>
                  <p className="font-semibold">{card.price} GTL</p>
                  <p className="text-sm">
                    Owned:{" "}
                    {
                      boosts.find((boost) => boost.title === card.title)
                        ?.owned ?? 0
                    }
                  </p>
                </div>

                <button
                  className="btn btn-base-100 ml-4 rounded-xl border-2"
                  onClick={() => handleBuyBoost(card.title)}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;