import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Header.css";

function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <nav>
        <div className="logo">Smart Expense Tracker</div>
        <div className="buttons">
          <button className="signup-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
