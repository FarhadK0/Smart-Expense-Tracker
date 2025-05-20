import React, { useState, useEffect } from "react";
import "../Styles/Sidebar.css";

function Sidebar({ activeTab, setActiveTab }) {
  const [username, setUsername] = useState("Loading...");
  const [isMobileVisible, setIsMobileVisible] = useState(false);

  // Check if we're on mobile
  const isMobile = () => window.innerWidth <= 768;

  // Toggle sidebar visibility on mobile
  const toggleMobileSidebar = () => {
    setIsMobileVisible(!isMobileVisible);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setIsMobileVisible(false);
  };

  // Close sidebar on menu item click (mobile only)
  const handleMenuItemClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile()) {
      setIsMobileVisible(false);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile()) {
        setIsMobileVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle-btn" onClick={toggleMobileSidebar}>
        <i className={`ri-${isMobileVisible ? "close" : "menu"}-line`}></i>
      </button>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isMobileVisible ? "mobile-visible" : ""}`}
        onClick={handleOverlayClick}
      ></div>
      <aside className={`sidebar ${isMobileVisible ? "mobile-visible" : ""}`}>
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
              onClick={() => handleMenuItemClick(tab.id)}
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
              <img src="https://i.pravatar.cc/150?img=60" alt="User" />
            </div>
            <div className="user-info">
              <div className="user-name">{username}</div>
              <div className="user-role">User</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
