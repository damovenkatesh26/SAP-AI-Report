// Components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('username');
  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
