// src/context/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// The shape of our user data
type User = {
  id: number;
  email: string;
  name: string;
  simulation_user_id: string; 
};

// The shape of the data our context will provide
type UserContextType = {
  user: User | null;
  isLoading: boolean; // This will tell the app if we are still checking for a user
};

// We create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true, // Always start in a loading state
});

// The UserProvider component will wrap our entire app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  // This effect runs only once when the app starts
  useEffect(() => {
    // Look for the auth_token in the URL that comes from WordPress
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('auth_token');

    if (token) {
      try {
        // Decode the token to get the user data
        const decodedUserData = JSON.parse(atob(token));
        // Save the user data into our state
        setUser(decodedUserData);
        // Clean the token from the URL bar so it looks neat
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("Failed to decode auth token:", e);
      }
    }
    
    // After we've checked for a token (even if we didn't find one), we are done loading.
    setLoading(false);
  }, []); // The empty array [] ensures this runs only once

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