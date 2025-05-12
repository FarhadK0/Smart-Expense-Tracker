// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import "../Styles/UserSetting.css";
import { FaEye, FaEyeSlash, FaEdit } from "react-icons/fa";
import "../Styles/UserSetting.css";

function UserSetting() {
  const [user, setUser] = useState({ name: "", email: "", income: 0 });
  const [formData, setFormData] = useState({ name: "", email: "", income: 0 });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
          setFormData(data.data);
        } else {
          showMessage(data.message, "error");
        }
      })
      .catch(() => {
        showMessage("Failed to load profile", "error");
      });
  }, []);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const showPasswordMessage = (msg, type = "success") => {
    setPasswordMessage(msg);
    setPasswordMessageType(type);
    setTimeout(() => setPasswordMessage(""), 5000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showMessage("Profile updated successfully", "success");
        setUser(formData);
        setIsEditing(false);
      } else {
        showMessage(data.message || "Update failed", "error");
      }
    } catch {
      showMessage("Error updating profile", "error");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (data.success) {
        showPasswordMessage("Password updated successfully", "success");
        setPasswordData({ currentPassword: "", newPassword: "" });
      } else {
        showPasswordMessage(data.message || "Password update failed", "error");
      }
    } catch {
      showPasswordMessage("Error updating password", "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      const res = await fetch("http://localhost:5000/api/user/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        showMessage(data.message || "Failed to delete account", "error");
      }
    } catch {
      showMessage("Error deleting account", "error");
    }
  };

  const toggleEdit = () => {
    if (isEditing) setFormData(user);
    setIsEditing(!isEditing);
  };

  return (
    <div className="userSettings-container">
      <h2>User Settings</h2>
      {message && (
        <div className={`userSettings-message ${messageType}`}>{message}</div>
      )}

      <div className="userSettings-section">
        <h3>Profile Information</h3>
        <form onSubmit={handleUpdateProfile}>
          <div className="userSettings-form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                isEditing && setFormData({ ...formData, name: e.target.value })
              }
              disabled={!isEditing}
              className={!isEditing ? "userSettings-input-disabled" : ""}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="userSettings-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                isEditing && setFormData({ ...formData, email: e.target.value })
              }
              disabled={!isEditing}
              className={!isEditing ? "userSettings-input-disabled" : ""}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="userSettings-form-group">
            <label htmlFor="income">Total Monthly Income</label>
            <input
              id="income"
              type="number"
              value={formData.income}
              onChange={(e) =>
                isEditing &&
                setFormData({
                  ...formData,
                  income: parseFloat(e.target.value) || 0,
                })
              }
              disabled={!isEditing}
              className={!isEditing ? "userSettings-input-disabled" : ""}
              placeholder="Enter your monthly income"
              min="0"
              step="0.01"
            />
          </div>

          {isEditing && (
            <div className="userSettings-button-group">
              <button type="submit" className="userSettings-save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="userSettings-cancel-btn"
                onClick={toggleEdit}
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        {!isEditing && (
          <button
            type="button"
            className="userSettings-edit-btn"
            onClick={toggleEdit}
          >
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>

      <div className="userSettings-section">
        <h3>Security</h3>
        <form onSubmit={handleUpdatePassword}>
          <div className="userSettings-form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="userSettings-password-input-wrapper">
              <input
                id="currentPassword"
                type={currentPasswordVisible ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Enter current password"
                required
              />
              <span
                className="userSettings-password-toggle"
                onClick={() =>
                  setCurrentPasswordVisible(!currentPasswordVisible)
                }
              >
                {currentPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="userSettings-form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="userSettings-password-input-wrapper">
              <input
                id="newPassword"
                type={newPasswordVisible ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Enter new password"
                required
              />
              <span
                className="userSettings-password-toggle"
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
              >
                {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {passwordMessage && (
            <div className={`userSettings-message ${passwordMessageType}`}>
              {passwordMessage}
            </div>
          )}

          <button type="submit" className="userSettings-update-password-btn">
            Update Password
          </button>
        </form>
      </div>

      <div className="userSettings-section userSettings-danger-zone">
        <h3>Account Actions</h3>
        <p className="userSettings-danger-text">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          className="userSettings-delete-btn"
          onClick={handleDeleteAccount}
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}

export default UserSetting;
