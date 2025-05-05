import React from "react";
import { FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

function DemoSetting() {
  return (
    <div className="settings-container">
      <div className="section-title">
        <span className="title-icon">
          <FaCog />
        </span>
        <h3>Settings (Read-Only)</h3>
      </div>

      <div className="settings-group">
        <h4>Account & Preferences</h4>
        <div className="settings-field">
          <strong>Financial Goal:</strong> Save More
        </div>
        <div className="settings-field">
          <strong>Monthly Income Range:</strong> £1000–£2000
        </div>
        <div className="settings-field">
          <strong>Expense Priority:</strong> Rent & Food
        </div>
      </div>

      <div className="settings-group">
        <h4>Notifications</h4>
        <div className="settings-field">
          <strong>Budget Alerts:</strong> Enabled (75% and 90% thresholds)
        </div>
        <div className="settings-field">
          <strong>Subscription Renewals:</strong> 3 days before
        </div>
        <div className="settings-field">
          <strong>Weekly Summary:</strong> Sundays at 6PM
        </div>
      </div>

      <div className="settings-group">
        <h4>Display Options</h4>
        <div className="settings-field">
          <strong>Currency:</strong> GBP (£)
        </div>
        <div className="settings-field">
          <strong>Date Format:</strong> DD/MM/YYYY
        </div>
        <div className="settings-field">
          <strong>Dark Mode:</strong> System default
        </div>
      </div>

      <p className="note">
        Settings are locked in demo mode.{" "}
        <Link to="/signup">Sign up to personalize</Link> and start tracking your
        actual expenses.
      </p>
    </div>
  );
}

export default DemoSetting;
