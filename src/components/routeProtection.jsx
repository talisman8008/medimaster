import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // check if token is there in local storage or not
    // acceept the token from backend and compare
    const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";

    if (!isAuthenticated) {
        //if false redirects to login page
        return <Navigate to="/" replace />;
    }

    // Agar login hai, toh dashboard dikhao
    return children;
};

export default ProtectedRoute;