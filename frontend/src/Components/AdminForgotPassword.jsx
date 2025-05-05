import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdEmail, MdArrowBack, MdCheckCircle } from "react-icons/md";
import "../Styles/ForgotPassword.css";
import AdminService from "../../Services/AdminService";

function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Basic validation
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      //call the reset password API
      await AdminService.forgotPassword(email);

      //show success message
      setSuccess(true);
    } catch (error) {
      setError(error.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h1>Reset Your Password</h1>
            <p>Enter your email address to recieve a password reset link</p>
          </div>

          {error && <div className="forgot-password-error">{error}</div>}

          {!success ? (
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-container">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={loading}
                    required
                  />
                  <span className="input-icon">
                    <MdEmail />
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className={`reset-button ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">
                <MdCheckCircle />
              </div>
              <h2>Check Your Email</h2>
              <p>
                {" "}
                We have sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions to reset
                your password.
              </p>
              <p className="note">
                if you don't recieve the email within a few minutes, please
                check your spam folder.
              </p>
            </div>
          )}
          <div className="forgot-password-footer">
            <Link to="/admin/login" className="back-to-login">
              <MdArrowBack />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminForgotPassword;
