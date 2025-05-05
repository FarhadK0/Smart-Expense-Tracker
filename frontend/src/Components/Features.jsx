import React from "react";
import { FaClock, FaChartBar, FaBell } from "react-icons/fa";
import "../Styles/Features.css";

function Features() {
  return (
    <section className="features">
      <div className="features-grid">
        <div className="feature-card">
          <div className="clock-icon">
            <FaClock />
          </div>
          <div className="feature-content">
            <h3>Real Time Tracking</h3>
            <p>
              Instantly update and moniter your expenses as they happen.Get a
              clear picture of your spending patterns in real-time
            </p>
          </div>
        </div>

        <div className="feature-card">
          <div className="chart-icon">
            <FaChartBar />
          </div>
          <div className="feature-content">
            <h3>Viusal Reports</h3>
            <p>
              Transform your financial data into clear, actionable insights with
              beautiful charts and garphs. Undersatnd your spending habits at a
              glance
            </p>
          </div>
        </div>

        <div className="feature-card">
          <div className="bell-icon">
            <FaBell />
          </div>
          <div className="feature-content">
            <h3>Budget Alerts</h3>
            <p>
              Never exceed your spending limits again. Recevie timely
              notifications when you're approaching your budget thresholds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
