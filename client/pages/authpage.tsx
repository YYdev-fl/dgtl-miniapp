import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import Link from 'next/link';

const AuthPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        let initDataRaw = window.Telegram.WebApp.initData;

        if (!initDataRaw) {
          // Simulate Telegram data for testing in Chrome
          console.log('Simulating Telegram data for development');
          initDataRaw = 'user={"id":123456,"first_name":"John","username":"johndoe"}';
        }

        if (initDataRaw) {
          const initData = new URLSearchParams(initDataRaw);
          const userRaw = initData.get('user');

          if (userRaw) {
            const user = JSON.parse(userRaw);
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
    } else if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen w-screen bg-base-100">
      <div className="loading loading-spinner loading-lg mb-4"></div>
    </div>;
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-base-100">
      <div className="loading loading-spinner loading-lg mb-4"></div>
    </div>
  );
};

export default AuthPage;
