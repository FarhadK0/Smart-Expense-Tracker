import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "../Styles/AdminSetting.css";

function AdminSetting() {
  const [admin, setAdmin] = useState({ name: "", email: "" });
  const [realAdminDetails, setRealAdminDetails] = useState({
    name: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("http://localhost:5000/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data?.admin) {
          setAdmin({ name: data.admin.name, email: data.admin.email });
          setRealAdminDetails({
            name: data.admin.name,
            email: data.admin.email,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load admin profile: ", error);
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  useEffect(() => {
    if (profileMessage?.text) {
      const timer = setTimeout(() => {
        setProfileMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [profileMessage]);

  useEffect(() => {
    if (passwordMessage?.text) {
      const timer = setTimeout(() => {
        setPasswordMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [passwordMessage]);

  useEffect(() => {
    if (deleteMessage?.text) {
      const timer = setTimeout(() => {
        setDeleteMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteMessage]);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    if (isEditing) {
      setAdmin(realAdminDetails);
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(admin),
      });

      const data = await res.json();
      if (res.ok) {
        setProfileMessage({
          text: "Profile updated Successfully!",
          type: "success",
        });
        localStorage.setItem("adminName", admin.name);
        setRealAdminDetails(admin);
        setIsEditing(false);
      } else {
        setProfileMessage({
          text: data.message || "Failed to update profile",
          type: "error",
        });
      }
    } catch (error) {
      setProfileMessage({
        text: "Server Error. Please tryagain.",
        type: "error",
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!password.currentPassword || !password.newPassword) {
      setPasswordMessage({
        text: "Please provide both current and new passwords",
        type: "error",
      });
      return;
    }

    if (password.currentPassword === password.newPassword) {
      setPasswordMessage({
        text: "New password cannot be the same as current password",
        type: "error",
      });
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        "http://localhost:5000/api/admin/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(password),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setPasswordMessage({
          text: "Passwod updated successfully!",
          type: "success",
        });
        setPassword({
          currentPassword: "",
          newPassword: "",
        });
      } else {
        setPasswordMessage({
          text: data.message || "Failed to update password",
          type: "error",
        });
      }
    } catch (error) {
      setPasswordMessage({
        text: "Server error. PLease try agian.",
        type: "error",
      });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? You will lose all you data."
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.clear();
        alert("Account deleted successfully!");
        window.location.href = "/admin";
      } else {
        setDeleteMessage({
          text: data.message || "Failed to delete account",
          type: "error",
        });
      }
    } catch (error) {
      setDeleteMessage({
        text: "Server error. Please try again",
        type: "error",
      });
    }
  };

  return (
    <div className="admin-setting-container">
      <h2 className="admin-setting-title">Admin Account Setting</h2>

      {loading ? (
        <div className="admin-loading-state">
          <div className="admin-spinner">
            <p>Laoding admin details...</p>
          </div>
        </div>
      ) : (
        <>
          <form className="admin-setting-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="name">UserName</label>
              <input
                type="text"
                id="name"
                name="name"
                value={admin.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
                placeholder="Enter your email address"
              />
            </div>
            <div className="admin-btn-group">
              <button
                type="button"
                className="admin-btn edit-cancel"
                onClick={handleEdit}
              >
                {isEditing ? "Cancel" : "Edit Details"}
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn-save"
                disabled={!isEditing}
              >
                Save Changes
              </button>
            </div>
            {profileMessage?.text && (
              <div
                className={`admin-setting-message admin-message-${profileMessage.type}`}
              >
                {profileMessage.text}
              </div>
            )}
          </form>

          <h3 className="admin-section-title">Security</h3>

          <div className="admin-password-section">
            <form onSubmit={handlePasswordChange}>
              <div className="admin-form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="admin-password-field">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    placeholder="Enter your current password"
                    value={password.currentPassword}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />

                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    tabIndex="-1"
                    aria-label={
                      showCurrentPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="admin-password-field">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="Enter your new password"
                    value={password.newPassword}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />

                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex="-1"
                    aria-label={
                      showNewPassword ? "HidePassword" : "Show password"
                    }
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="admin-btn admin-btn-update">
                Update Password
              </button>
              {passwordMessage?.text && (
                <div
                  className={`admin-setting-message admin-message-${passwordMessage.type}`}
                >
                  {passwordMessage.text}
                </div>
              )}
            </form>
          </div>

          <div className="admin-danger-zone">
            <h3 className="admin-danger-zone-title">Danger Zone</h3>
            <p className="admin-danger-zone-description">
              {" "}
              This will permanantely delet your account and all data. This
              action cannot be undone.
            </p>

            <button
              className="admin-btn  admin-btn-delete"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>

          {deleteMessage?.text && (
            <div
              className={`admin-setting-message admin-message-${deleteMessage.type}`}
            >
              {deleteMessage.text}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminSetting;
