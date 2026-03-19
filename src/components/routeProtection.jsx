import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // check if token is there in local storage or not
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!token && !isLoggedIn) {
        //if false redirects to login page
        return <Navigate to="/" replace />;
    }

    // Agar login hai, toh dashboard dikhao
    return children;
};

export default ProtectedRoute;