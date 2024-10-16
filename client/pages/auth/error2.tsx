import Link from 'next/link';

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-black-100">
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="mb-6 text-lg">Telegram WebApp is not available</p>
      <Link href="/">
        <button className="btn btn-accent">Go Back to Home</button>
      </Link>
    </div>
  );
};

export default ErrorPage;
