import React, { useState, useEffect } from "react";
import "../styles/Sidebar.css";

function Sidebar({ activeTab, setActiveTab }) {
  const [username, setUsername] = useState("Loading...");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const { data } = await response.json();
        setUsername(data.name);
      } catch (error) {
        console.error("Error fetching username:", error);
        setUsername("User");
      }
    };

    fetchUsername();
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
    { id: "expense", label: "Expense", icon: "ri-money-dollar-circle-line" },
    { id: "budgets", label: "Budgets", icon: "ri-pie-chart-line" },
    { id: "insights", label: "Insights", icon: "ri-line-chart-line" },
    { id: "reports", label: "Reports", icon: "ri-file-chart-line" },
    { id: "settings", label: "Settings", icon: "ri-settings-4-line" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">SE</div>
          <div className="logo-text">SmartEx</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={tab.icon}></i>
            <span>{tab.label}</span>
            {activeTab === tab.id && <div className="active-indicator"></div>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            <img
              src="data:image/jpeg;base64,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"
              alt="User"
            />
          </div>
          <div className="user-info">
            <div className="user-name">{username}</div>
            <div className="user-role">User</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
