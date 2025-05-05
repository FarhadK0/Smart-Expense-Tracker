import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdArrowBack,
  MdCheckCircle,
} from "react-icons/md";
import "../Styles/ResetPassword.css";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill in both fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reset password. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <h1>Set New Password</h1>
            <p>Please create a new password</p>
          </div>

          {error && <div className="reset-password-error">{error}</div>}

          {!success ? (
            <form onSubmit={handleSubmit} className="reset-password-form">
              <div className="reset-form-group">
                <label htmlFor="password">New Password</label>
                <div className="reset-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    disabled={loading}
                  />
                  <span className="reset-input-icon">
                    <MdLock />
                  </span>
                  <button
                    type="button"
                    className="reset-password-toggle"
                    onClick={togglePasswordVisibility}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className="reset-form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="reset-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmpassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={loading}
                  />
                  <span className="reset-input-icon">
                    <MdLock />
                  </span>
                  <button
                    type="button"
                    className="reset-password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <MdVisibilityOff />
                    ) : (
                      <MdVisibility />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`reset-button ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Resetting.." : "Reset Password"}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">
                <MdCheckCircle size={36} color="green" />
              </div>
              <h2>Password Reset Successful</h2>
              <p>You will be redirected to login shortly.</p>
            </div>
          )}

          <div className="reset-password-footer">
            <button
              onClick={() => navigate("/login")}
              className="back-to-login"
            >
              <MdArrowBack /> Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
