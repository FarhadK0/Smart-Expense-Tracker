import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  Gift,
  Mail,
  ChevronDown,
  ChevronUp,
  Home,
} from "lucide-react";
import "../Styles/HelpPage.css";

function HelpPage() {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({
    usingFeatures: true,
    frequentlyAsked: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="help-page">
      <header className="help-page-header">
        <HelpCircle className="help-page-icon" />
        <div>
          <h1>Help Center</h1>
          <p className="intro">Need assistance? You're in the right place.</p>
        </div>
      </header>

      <div className="help-page-content">
        {/* Using Features Section */}
        <section className="help-section">
          <div
            className="help-section-header"
            onClick={() => toggleSection("usingFeatures")}
          >
            <div className="help-section-title">
              <Gift className="section-icon" />
              <h2>Using Features</h2>
            </div>
            {openSections.usingFeatures ? <ChevronUp /> : <ChevronDown />}
          </div>
          {openSections.usingFeatures && (
            <ul className="help-section-content">
              <li>
                <strong>Expenses:</strong> Add, edit, or delete transactions
                with date and category.
              </li>
              <li>
                <strong>Budgets:</strong> Set monthly budgets per category and
                get notified if you exceed limits.
              </li>
              <li>
                <strong>Reports:</strong> Download spending reports and view
                visual summaries.
              </li>
              <li>
                <strong>Alerts:</strong> Receive reminders for upcoming bills
                and budget thresholds.
              </li>
            </ul>
          )}
        </section>

        {/* Frequently Asked Questions Section */}
        <section className="help-section">
          <div
            className="help-section-header"
            onClick={() => toggleSection("frequentlyAsked")}
          >
            <div className="help-section-title">
              <HelpCircle className="section-icon" />
              <h2>Frequently Asked Questions</h2>
            </div>
            {openSections.frequentlyAsked ? <ChevronUp /> : <ChevronDown />}
          </div>
          {openSections.frequentlyAsked && (
            <ul className="help-section-content faq-content">
              <li>
                <h3>Why can't I see my budget alerts?</h3>
                <p>
                  Ensure you've set a valid start/end date for each budget and
                  check if your expenses fall under the same period.
                </p>
              </li>
              <li>
                <h3>Can I export my data?</h3>
                <p>
                  Yes! Use the Reports section to download monthly summaries.
                </p>
              </li>
              <li>
                <h3>Is my data private?</h3>
                <p>
                  Absolutely. We do not share your data, and all actions are
                  secured with token-based authentication.
                </p>
              </li>
            </ul>
          )}
        </section>

        {/* Contact Section */}
        <section className="help-section contact-section">
          <div className="help-section-header">
            <div className="help-section-title">
              <Mail className="section-icon" />
              <h2>Still Need Help?</h2>
            </div>
          </div>
          <div className="help-section-content contact-content">
            <p>Reach out to our support team via email:</p>
            <a href="mailto:smartx660@gmail.com" className="contact-email">
              support@smartexpensetracker.com
            </a>
          </div>
        </section>

        {/* Go to Dashboard Button */}
        <div className="dashboard-button-container">
          <button className="go-to-dashboard-btn" onClick={handleGoToDashboard}>
            <Home className="button-icon" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
