import React, { useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import "../Styles/AdminCreate.css";

function AdminCreate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        "http://localhost:5000/api/admin/signup",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Admin created successfully!");
      setMessageType("success");
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create admin.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="admin-create-container">
      <div className="admin-create-card">
        <div className="admin-create-header">
          <UserPlus className="admin-create-icon" />
          <h2>Create New Admin</h2>
        </div>

        {message && (
          <div className={`admin-message ${messageType}`}>
            {messageType === "success" ? (
              <CheckCircle className="message-icon" />
            ) : (
              <AlertCircle className="message-icon" />
            )}
            {message}
          </div>
        )}

        <form className="admin-create-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="name">
              <User className="form-icon" />
              Full Name
            </label>
            <div className="input-wrapper">
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter admin name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className={loading ? "input-disabled" : ""}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="email">
              <Mail className="form-icon" />
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter admin email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className={loading ? "input-disabled" : ""}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">
              <Lock className="form-icon" />
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className={loading ? "input-disabled" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {passwordVisible ? <Lock size={20} /> : <Lock size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-create-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="admin-create-loading-spinner"></span>
            ) : (
              <>
                <UserPlus size={20} />
                Create Admin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminCreate;
