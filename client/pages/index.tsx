import Link from "next/link";
import Layout from "../components/layout";
import Reat, {useEffect} from "react";

function Index() {
  
  useEffect(() => {
    // Check if Telegram API is available
    if (typeof window !== 'undefined' && window.Telegram) {
      // Initialize the Telegram WebApp
      window.Telegram.WebApp.ready();
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      const tgWebAppData = params.get('tgWebAppData');
      if (tgWebAppData) {
        const decodedData = decodeURIComponent(tgWebAppData);

      // If the data is in JSON format, convert it to an object for easier access
      try {
          const dataObject = JSON.parse(decodedData);
          alert(JSON.stringify(dataObject, null, 2)); // Display it as a formatted JSON string
          console.log(dataObject); // You can inspect the object in the console
      } catch (error) {
          alert("Failed to parse JSON data: " + error);
      }
    
    } else {
      alert("Telegram WebApp not found");
    }
      }
      
  }, []); 

  return (
    <Layout>
      <div className="flex flex-col min-h-screen p-3">
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

        {/* New Level Card Section */}
        <div className="card bg-neutral mt-4">
          <div className="card-body p-4 text-white">
            <h2 className="card-title text-xl mb-3">Levels</h2>

            {/* Level 1 */}
            <div className="relative bg-neutral-content rounded-lg mb-2 shadow-inner overflow-hidden">
            {/* Badge Container */}
            <div className="flex absolute top-2 left-2 flex-wrap gap-2 z-10"> {/* Positioning badges */}
              <div className="badge badge-outline">Au</div>
              <div className="badge badge-outline">Fe</div>
              <div className="badge badge-outline">C</div>
              <div className="badge badge-outline">Br</div>
              
            </div>

            {/* Background Image */}
            <img
              src="/level1-bg.png"
              alt="Level 1"
              className="h-[150px] w-full object-cover"
            />

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Level 1</h2>
                <p className="text-m font-bold">10 ⛏</p>
              </div>
              <Link href="/game">
                <button className="btn btn-md border-2 border-accent shadow-glow">Play</button>
              </Link>
            </div>
          </div>


            
            
          </div>
        </div>

        
      </div>
    </Layout>
  );
}

export default Index;
