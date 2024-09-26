// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'

// Define the shape of our AuthContext
interface AuthContextType {
  user: any; // Replace 'any' with a more specific type if you have one
  setUser: (user: any) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        // Fetch user data from backend using Telegram Web App initData
        const tg = window.Telegram?.WebApp;
        if (!tg || !tg.initData) return;

        const initData = tg.initData;

        const response = await axios.get('/auth/me', {
          headers: {
            'x-telegram-initdata': initData,
          },
          withCredentials: true,
        });

        setUser(response.data.data);
      } catch (error) {
        console.error('Failed to authenticate user:', error);
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
