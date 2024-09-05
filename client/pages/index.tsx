import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

const Game = dynamic(() => import("../components/Game"), { ssr: false });

function Index() {
  const [isGameVisible, setIsGameVisible] = useState(false);

  return (
    <div className="flex flex-col min-h-screen p-3">
      {isGameVisible ? (
        <Game />
      ) : (
        <>
          {/* Main Card */}
          <div className="card bg-neutral shadow-xl mb-3">
            <div className="card-body text-white p-4">
              <h2 className="card-title text-2xl">ascar</h2>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats bg-neutral text-primary-content">
            <div className="stat">
              <div className="stat-title">Account balance</div>
              <div className="stat-value text-white text-3xl">5,400 GTL</div>
            </div>
            <div className="stat">
              <div className="stat-title">LVL</div>
              <div className="stat-value text-white text-5xl">1</div>
            </div>
          </div>

          {/* Level Card Section */}
          <div className="card bg-neutral shadow-lg mt-4">
            <div className="card-body text-white">
              <h2 className="card-title text-xl mb-3">Levels</h2>

              {/* Level 1 */}
              <div className="relative bg-neutral-content rounded-lg mb-2 shadow-inner overflow-hidden">
                <img
                  src="/level1-bg.png"
                  alt="Level 1"
                  className="w-full object-cover "
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent flex items-center justify-between ">
                  <div className="text-lg font-bold text-white">Level 1</div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setIsGameVisible(true)}
                  >
                    Play
                  </button>
                </div>
              </div>

              {/* Level 2 */}
              <div className="relative bg-neutral-content rounded-lg mb-2 shadow-inner overflow-hidden">
                <img src="" alt="Level 2" className="w-full object-cover h-24" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent flex items-center justify-between ">
                  <div className="text-lg font-bold text-white">Level 2</div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setIsGameVisible(true)}
                  >
                    Play
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div
            role="tablist"
            className="fixed bottom-0 left-0 right-0 tabs tabs-boxed p-3"
          >
            <a
              role="tab"
              className="tab border-2 border-accent shadow-glow h-16"
              href="/"
            >
              <img src="/icons/white/home-1.svg" alt="Home" className="w-8 h-8" />
            </a>
            <a role="tab" className="tab h-16" href="/boosts">
              <img
                src="/icons/white/basket.svg"
                alt="Boosts"
                className="w-8 h-8"
              />
            </a>
            <a role="tab" className="tab h-16" href="/tasks">
              <img
                src="/icons/white/invoice-1.svg"
                alt="Tasks"
                className="w-8 h-8"
              />
            </a>
            <a role="tab" className="tab h-16" href="/friends">
              <img
                src="/icons/white/user-group.svg"
                alt="Friends"
                className="w-8 h-8"
              />
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default Index;
