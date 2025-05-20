import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import AdminService from "../../Services/AdminService";
import "../Styles/AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await AdminService.login({ email, password });

      localStorage.setItem("adminToken", res.token);
      localStorage.setItem("adminName", res.admin.name);

      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToHome = () => {
    navigate("/admin");
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h2>Admin Portal</h2>
            <p>Enter your login details to access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <div className="input-icon">
                <FaEnvelope />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="forgot-password-container">
              <Link
                to="/admin/forgot-password"
                className="forgot-password-link"
              >
                Forgot Password?
              </Link>
            </div>

            {error && <div className="admin-login-error">{error}</div>}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <span className="admin-loading-spinner">
                  <FaSpinner className="spinner-icon" /> Loading...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <button type="button" className="back-button" onClick={goToHome}>
              <FaArrowLeft /> Back to Home
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
