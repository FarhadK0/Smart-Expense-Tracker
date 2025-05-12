import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/AboutUs.css";

function AboutUs() {
  const navigate = useNavigate();

  return (
    <section className="about-us-section">
      <div className="about-us-container">
        <div className="about-us-content">
          <h2>About Smart Expense Tracker</h2>
          <div className="about-us-description">
            <p>
              Smart Expense Tracker is a powerful tool designed to help
              individuals and businesses take control of their finances. Our
              platform enables seamless expense tracking, budgeting, and
              reporting — all in one place.
            </p>
            <p>
              Whether you're managing daily personal expenses or overseeing your
              company's financial health, we provide smart insights and
              real-time alerts to keep you on track.
            </p>
          </div>
          <button
            className="about-us-btn"
            onClick={() => navigate("/about-page")}
          >
            Learn More About Us
          </button>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
