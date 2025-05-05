import React from "react";
import { Navigate } from "react-router-dom";
import AdminService from "./Services/AdminService";

function AdminProtectedRoute({ children }) {
  const isAuthenticated = AdminService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
