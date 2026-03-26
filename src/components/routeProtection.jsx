import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check kar rahe hain ki kya user logged in hai
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Agar true hai, toh andar jaane do (children render karo)
    if (isLoggedIn === "true") {
        return children;
    }

    // Agar nahi hai, toh laat maar ke Login page ("/") pe bhej do
    return <Navigate to="/" replace />;
};

export default ProtectedRoute;