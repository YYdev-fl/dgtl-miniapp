import React from "react";
import Layout from "../components/layout";

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
    owned: 2,
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
    owned: 4,
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
  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Main content */}
        <div className="flex-grow">
          <div className="text-center p-5">
            <h1 className="text-3xl font-bold p-2">🚀 Store</h1>
            <p className="p-2">
              Purchase utilities to accelerate your mineral mining speed!
            </p>
          </div>

          {/* Card Section */}
          <div className="p-3">
            <div className="card bg-base-100 shadow-md text-white border-2 border-accent shadow-glow">
              <div className="card-body flex justify-center items-center">
                <h2 className="card-title text-center text-2xl font-bold">
                  Welcome to the shop
                </h2>
              </div>
            </div>
          </div>

          {/* Horizontal Cards */}
          <div className="card bg-neutral text-white p-5 shadow-lg m-3 shadow-md">
            <h2 className="card-title text-center mb-4">Boost Cards</h2>
            <div className="flex flex-col gap-4">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center bg-secondary text-white p-4 rounded-xl  "
                >
                  {/* Card Image */}
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-20 h-20 object-contain mr-4 rounded-xl"
                  />

                  {/* Card Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{card.title}</h3>
                    <p className="font-semibold">{card.price} GTL</p>
                    <p className="text-sm">Owned: {card.owned}</p>
                  </div>

                  {/* Buy Button */}
                  <button className="btn btn-base-100 ml-4 rounded-xl border-2  ">Buy</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Section 2*/}
        <div className="p-3">
            <div className="card bg-base-100 shadow-md text-white border-2 border-accent shadow-glow">
              <div className="card-body flex justify-center items-center">
                <h2 className="card-title text-center text-2xl font-bold">
                  Collections
                </h2>
              </div>
            </div>
          </div>
              
        
          <div className="card bg-neutral text-white p-5 shadow-lg m-3 shadow-md">
    <h2 className="card-title text-center mb-4">Periodic table</h2>
    <div className="grid grid-cols-2 gap-4">
      {minerals.map((card, index) => (
        <div
          key={index}
          className="flex items-center bg-secondary text-white p-4 rounded-xl"
        >
          {/* Card Image */}
          <img
            src={card.imageUrl}
            className="w-22 h-22 object-contain mr-4 rounded-xl"
          />
          {/* <div className="flex-1">
            <h3 className="font-bold text-lg">{card.title}</h3>
            <p className="font-semibold">{card.price}</p>
            <p className="text-sm">{card.weight}</p>
          </div> */}
        </div>
      ))}
    </div>
  </div>


    
      </div>
    </Layout>
  );
};

export default Index;
