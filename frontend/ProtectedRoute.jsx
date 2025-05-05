// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "./Services/AuthService";

const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated
  const isAuthenticated = AuthService.isAuthenticated();

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;
