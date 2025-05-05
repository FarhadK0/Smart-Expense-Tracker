import React from "react";
import "../Styles/Stats.css";

function Stats() {
  return (
    <section className="stats">
      <h2>Trusted by Thousands</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <h3>10K+</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-item">
          <h3>£2M+</h3>
          <p>Expenses Tracked</p>
        </div>
        <div className="stat-item">
          <h3>95%</h3>
          <p>User Satisfaction</p>
        </div>
      </div>
    </section>
  );
}

export default Stats;
