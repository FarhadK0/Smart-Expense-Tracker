import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, UserPlus } from "lucide-react";
import "../Styles/AdminHome.css";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <div className="admin-panel">
        <div className="Admin-header">
          <h1>Admin Dashboard</h1>
          <p>Smart Expense Tracker Management Panel</p>
        </div>

        <div className="admin-cards">
          <div className="admin-card">
            <div className="card-icon">
              <ShieldCheck size={48} />
            </div>
            <div className="card-content">
              <h2>Login</h2>
              <p>Access your admin account</p>
              <button
                onClick={() => navigate("/admin/login")}
                className="admin-Btn Login-btn"
              >
                <ShieldCheck size={20} />
                Login
              </button>
            </div>
          </div>

          <div className="admin-card">
            <div className="card-icon">
              <UserPlus size={48} />
            </div>
            <div className="card-content">
              <h2>Register</h2>
              <p>Create a new admin account</p>
              <button
                onClick={() => navigate("/admin/signup")}
                className="admin-Btn Signup-btn"
              >
                <UserPlus size={20} />
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
