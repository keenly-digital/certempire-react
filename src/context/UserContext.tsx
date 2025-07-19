import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type User = {
  id: number;
  email: string;
  name: string;
  simulation_user_id: string;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  logout: () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in URL (from WordPress)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('auth_token');

    if (token) {
      try {
        const decodedUserData = JSON.parse(atob(token));
        setUser(decodedUserData);
        localStorage.setItem('app_user_session', JSON.stringify(decodedUserData));
        window.history.replaceState({}, document.title, window.location.pathname);
        setLoading(false);
        return;
      } catch (e) {
        console.error("Failed to decode auth token:", e);
      }
    }

    // If no token, check localStorage for existing session
    const storedUser = localStorage.getItem('app_user_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Logout clears session and reloads the page (or navigate home)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user_session');
    window.location.href = '/'; // Optional: redirect to homepage
  };

  return (
    <UserContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
