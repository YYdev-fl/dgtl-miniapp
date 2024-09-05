import React from "react";

// Define the type for each card's data
interface CardData {
  title: string;
  price: string;
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

const Index: React.FC = () => {
  return (
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

      {/* Tab Navigation */}
      <div role="tablist" className="fixed bottom-0 left-0 right-0 tabs tabs-boxed p-3">
        <a role="tab" className="tab h-16 " href="/">
          <img src="/icons/white/home-1.svg" alt="Home" className="w-8 h-8"/>
        </a>
        <a role="tab" className="tab border-2 border-accent shadow-glow h-16" href="/boosts">
          <img src="/icons/white/basket.svg" alt="Home" className="w-8 h-8"/>
        </a>
        <a role="tab" className="tab h-16" href="/tasks">
          <img src="/icons/white/invoice-1.svg" alt="Home" className="w-8 h-8"/>
        </a>
        <a role="tab" className="tab h-16 " href="/friends">
          <img src="/icons/white/user-group.svg" alt="Home" className="w-8 h-8"/>
        </a>
      </div>
    </div>
  );
};

export default Index;
