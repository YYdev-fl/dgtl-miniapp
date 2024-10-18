import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


const AuthPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const authenticate = async () => {
      if (status === 'unauthenticated') {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          let initDataRaw = window.Telegram.WebApp.initData;

          if (!initDataRaw) {
            console.log('Simulating Telegram data for development');
            initDataRaw = 'user={"id":123456,"first_name":"John","username":"johndoe"}';
          }

          if (initDataRaw) {
            console.log('Signing in with initDataRaw:', initDataRaw);
            signIn('credentials', { initData: initDataRaw });
          } else {
            window.location.href = '/auth/error1';
          }
        } else {
          window.location.href = '/auth/error2';
        }
      } else if (status === 'authenticated') {
        router.push('/');
      }
    };

    authenticate();
  }, [status, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

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
