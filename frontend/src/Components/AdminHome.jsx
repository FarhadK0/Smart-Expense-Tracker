import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  PieChart,
  Users,
  Settings,
  ChevronRight,
  LogIn,
} from "lucide-react";
import "../Styles/AdminHome.css";

function AdminHome() {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      name: "Dashboard Overview",
      icon: <BarChart3 size={24} />,
      description: "View expense analytics and reports",
    },
    {
      id: 2,
      name: "User Management",
      icon: <Users size={24} />,
      description: "Manage user accounts and permissions",
    },
    {
      id: 3,
      name: "Analytics",
      icon: <PieChart size={24} />,
      description: "Detailed expense tracking statistics",
    },
    {
      id: 4,
      name: "Settings",
      icon: <Settings size={24} />,
      description: "Configure system preferences",
    },
  ];

  return (
    <div className="adminHome-container">
      <div className="adminHome-header">
        <div className="adminHome-header-content">
          <div className="adminHome-header-left">
            <h1 className="adminHome-header-title">Admin Dashboard</h1>
            <p className="adminHome-header-subtitle">
              Smart Expense Tracker Management Panel
            </p>
          </div>
          <div className="adminHome-header-right">
            <button
              onClick={() => navigate("/admin/login")}
              className="adminHome-header-login-button"
            >
              <LogIn size={20} />
              Login
            </button>
          </div>
        </div>
      </div>

      <div className="adminHome-main-content">
        <div className="adminHome-dashboard-layout">
          <div className="adminHome-features-section">
            <h2 className="adminHome-features-title">Admin Features</h2>
            <div className="adminHome-features-grid">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="adminHome-feature-card"
                  onMouseEnter={() => setHovered(feature.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="adminHome-feature-icon-container">
                    {feature.icon}
                  </div>
                  <div className="adminHome-feature-content">
                    <h3 className="adminHome-feature-name">{feature.name}</h3>
                    <p className="adminHome-feature-description">
                      {feature.description}
                    </p>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`adminHome-feature-chevron ${
                      hovered === feature.id ? "adminHome-chevron-hovered" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="adminHome-footer">
        <p className="adminHome-footer-text">
          Smart Expense Tracker © 2025 • All Rights Reserved
        </p>
      </div>
    </div>
  );
}

export default AdminHome;
