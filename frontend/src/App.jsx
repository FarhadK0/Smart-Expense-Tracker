import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ForgotPassword from "./Components/ForgotPassword";
import ProtectedRoute from "/ProtectedRoute";
import Demo from "./Components/Demo";
import RealDashboard from "./Components/Dashboard";
import AdminLogin from "./Components/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard";
import AdminProtectedRoute from "/AdminProtectedRoute";
import AdminHome from "./Components/AdminHome";
import AdminForgotPassword from "./Components/AdminForgotPassword";
import AdminResetPassword from "./Components/AdminResetPassword";
import ResetPassword from "./Components/ResetPassword";
import Notification from "./Components/Notification";
import AboutPage from "./Components/AboutPage";
import HelpPage from "./Components/Help";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/about-page" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RealDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/forgot-password"
          element={<AdminForgotPassword />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route path="/admin" element={<AdminHome />} />

        <Route
          path="/admin/reset-password/:token"
          element={<AdminResetPassword />}
        />

        <Route path="/notification" element={<Notification />} />
      </Routes>
    </Router>
  );
}

export default App;
