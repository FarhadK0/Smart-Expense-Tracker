import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaQuestionCircle } from "react-icons/fa";
import "../styles/DashboardHeader.css";

function Header() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("User");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/notification", {
          headers: {
            Authorization: `Bearer ${token} `,
          },
        });
        const data = await res.json();
        setNotificationCount(data.length);
      } catch (error) {
        console.error("Failed to load notification:", error.message);
      }
    };
    fetchNotification();
  }, []);
  // Fetch user's name on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data?.data?.name) {
          setUserName(data.data.name);
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName("User");
      }
    };

    fetchUser();
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
    <header className="dashboard-header">
      <div className="greeting-container">
        <h2>
          <span className="greeting-text">
            {getGreeting()}, {userName?.split(" ")[0] || "User"}
          </span>
        </h2>
        <p className="current-date">{formatDate()}</p>
      </div>

      <div className="welcome-container">
        <span className="welcome-message">
          Welcome back to your financial dashboard
        </span>
      </div>

      <div className="header-actions">
        <div
          className="notification-icon"
          onClick={() => navigate("/notification")}
        >
          <FaBell />
          {notificationCount > 0 && (
            <span className="badge">{notificationCount}</span>
          )}{" "}
        </div>

        <button className="btn help-btn" onClick={() => navigate("/help")}>
          <FaQuestionCircle className="help-icon" />
          Help
        </button>

        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
