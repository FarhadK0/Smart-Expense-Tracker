import React, { useEffect, useState } from "react";
import {
  Bell,
  Trash2,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import "../Styles/Notification.css";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/notification", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notification/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const clearNotifications = async () => {
    try {
      await fetch("http://localhost:5000/api/notification", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications([]);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Function to determine notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type.toLowerCase()) {
      case "info":
        return <Info className="notification-icon notification-icon-info" />;
      case "warning":
        return (
          <AlertTriangle className="notification-icon notification-icon-warning" />
        );
      case "success":
        return (
          <CheckCircle className="notification-icon notification-icon-success" />
        );
      case "error":
        return (
          <AlertTriangle className="notification-icon notification-icon-error" />
        );
      default:
        return <Bell className="notification-icon notification-icon-info" />;
    }
  };

  // Function to determine notification class based on type
  const getNotificationClass = (type) => {
    return `notification-item notification-${type.toLowerCase()}`;
  };

  return (
    <div className="notification-container">
      <div className="notification-wrapper">
        <div className="notification-header">
          <h2 className="notification-title">
            <Bell className="notification-header-icon" />
            Notifications
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </h2>
          {notifications.length > 0 && (
            <button
              className="notification-clear-btn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="notification-clear-icon" /> Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="notification-loading-container">
            <div className="notification-loading-spinner"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty-state">
            <Bell className="notification-empty-icon" />
            <p className="notification-empty-title">No notifications yet</p>
            <p className="notification-empty-subtitle">
              When you receive notifications, they will appear here
            </p>
          </div>
        ) : (
          <ul className="notification-list">
            {notifications.map((note) => (
              <li key={note._id} className={getNotificationClass(note.type)}>
                <div className="notification-content">
                  <div className="notification-icon-container">
                    {getNotificationIcon(note.type)}
                  </div>
                  <div className="notification-details">
                    <div className="notification-meta">
                      <span
                        className={`notification-type-badge notification-type-${note.type.toLowerCase()}`}
                      >
                        {note.type}
                      </span>
                    </div>
                    <p className="notification-message">{note.message}</p>
                    <p className="notification-time">
                      {new Date(note.createdAt).toLocaleString("en-GB")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteNotification(note._id)}
                  className="notification-delete-btn"
                  aria-label="Delete notification"
                >
                  <X className="notification-delete-icon" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="notification-modal-overlay">
          <div className="notification-modal-container">
            <h3 className="notification-modal-title">
              Clear All Notifications
            </h3>
            <p className="notification-modal-message">
              Are you sure you want to delete all notifications? This action
              cannot be undone.
            </p>
            <div className="notification-modal-actions">
              <button
                className="notification-cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="notification-delete-all-btn"
                onClick={clearNotifications}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
