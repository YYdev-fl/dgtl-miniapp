import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import Layout from '../components/layout';
import Link from 'next/link';

const Index = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Safely access Telegram WebApp data
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const initDataRaw = window.Telegram.WebApp.initData;

        if (initDataRaw) {
          const initData = new URLSearchParams(initDataRaw);
          const userRaw = initData.get('user');

          if (userRaw) {
            const user = JSON.parse(userRaw);
            // Sign in using the parsed user data via Telegram credentials
            signIn('credentials', { initData: JSON.stringify(user) });
          } else {
            window.location.href = '/auth/error';
          }
        } else {
          window.location.href = '/auth/error1';
        }
      } else {
        window.location.href = '/auth/error2';
      }
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  return (
    <Layout>
      
      <div className="flex flex-col min-h-screen p-3">
        {/* Main Card */}
        <div className="card bg-neutral shadow-xl mb-3">
          <div className="card-body text-white p-4">
            <h2 className="card-title text-2xl">{session?.user.username}</h2>
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
