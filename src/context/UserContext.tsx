// src/context/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// The shape of our user data
type User = {
  id: number;
  email: string;
  name: string;
  simulation_user_id: string; 
};

// The shape of the data our context will provide to the app
type UserContextType = {
  user: User | null;
  isLoading: boolean; // This will tell the app if we are still identifying the user
};

// We create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true, // Always start in a loading state
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // This state is true when the app first loads, and false once we've checked for a user.
  const [isLoading, setLoading] = useState(true);

  // This effect runs only once when the app starts
  useEffect(() => {
    // Look for the auth_token in the URL that comes from WordPress
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('auth_token');

    if (token) {
      try {
        const decodedUserData = JSON.parse(atob(token));
        setUser(decodedUserData);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("Failed to decode auth token:", e);
      }
    }
    // After we've checked for a token, we are done loading.
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// This is the custom hook our pages will use to get the user info
export const useUser = () => {
  return useContext(UserContext);
};