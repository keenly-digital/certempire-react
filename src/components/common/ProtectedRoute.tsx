// src/components/common/ProtectedRoute.tsx
import React from "react";
import { useUser } from "../../context/UserContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useUser();

    if (isLoading) return null; // Optionally, show a loading spinner

    // If no valid user, redirect to WordPress login
    if (!user) {
        window.location.href = "https://certempire.com/my-account";
        return null;
    }

    // If user is valid, render children (the dashboard)
    return <>{children}</>;
};

export default ProtectedRoute;
