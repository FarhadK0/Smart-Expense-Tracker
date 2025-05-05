import React, { useState, useEffect } from "react";
import "../Styles/AdminDashboard.css";
import AdminSidebar from "./AdminSidebar";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminSetting from "./AdminSetting";

function AdminDashboard() {
  const [adminName, setAdminName] = useState("Admin");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name);
  }, []);
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");

    window.location.href = "/admin/login";
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        adminName={adminName}
      />

      <div className="admin-main">
        <header className="admin-header">
          <div className="header-greeting">
            <h2>
              {getGreeting()}, {adminName || "Admin"}
            </h2>
            <p className="current-date">{formatDate()}</p>
          </div>

          <div className="header-tools">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content">
          {activeSection === "overview" && <AdminOverview />}
          {activeSection === "users" && <AdminUsers />}
          {activeSection === "settings" && <AdminSetting />}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
