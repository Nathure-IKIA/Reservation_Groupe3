import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { isLoggedIn } from '../utils/auth';

const ProtectedRoute = ({ element }) => {
    // Utiliser la fonction isLoggedIn du auth.js
    if (!isLoggedIn()) {
        toast.error("Veuillez vous connecter pour accéder à cette page");
        return <Navigate to="/" replace />;
    }

    return element;
};

export default ProtectedRoute;
