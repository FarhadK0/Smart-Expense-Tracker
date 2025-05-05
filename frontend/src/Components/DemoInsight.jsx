import React from "react";
import {
  FaLightbulb as FaIdea,
  FaPiggyBank,
  FaChartLine,
  FaBullseye,
  FaUtensils,
  FaFilm,
  FaShoppingBag,
  FaExclamationTriangle,
} from "react-icons/fa";

function DemoInsight() {
  return (
    <div className="insights-page">
      <div className="section-title">
        <span className="title-icon">
          <FaIdea />
        </span>
        <h3>Smart Insights</h3>
      </div>

      <div className="recommendations-card">
        <div className="recommendations-header">
          <h4>Personalized Budget Recommendations</h4>
          <p>
            Our AI has analyzed your spending patterns and found ways to help
            you save more.
          </p>
        </div>

        <div className="recommendations-highlights">
          <div className="highlight-card">
            <span className="highlight-icon">
              <FaPiggyBank />
            </span>
            <div className="highlight-content">
              <h5>Potential Savings</h5>
              <p className="highlight-value">£120/month</p>
            </div>
          </div>

          <div className="highlight-card">
            <span className="highlight-icon">
              <FaChartLine />
            </span>
            <div className="highlight-content">
              <h5>Financial Score Impact</h5>
              <p className="highlight-value">+5 points</p>
            </div>
          </div>

          <div className="highlight-card">
            <span className="highlight-icon">
              <FaBullseye />
            </span>
            <div className="highlight-content">
              <h5>Savings Goal Impact</h5>
              <p className="highlight-value">Reach 4 months faster</p>
            </div>
          </div>
        </div>

        <div className="recommendation-categories">
          <div className="category-item">
            <span className="category-icon">
              <FaUtensils />
            </span>
            <div className="category-content">
              <h5>Food Budget</h5>
              <p>Reduce from £200 to £180</p>
              <div className="category-tips">
                <span>Cook at home more often</span>
                <span>Use meal planning</span>
              </div>
            </div>
          </div>

          <div className="category-item">
            <span className="category-icon">
              <FaFilm />
            </span>
            <div className="category-content">
              <h5>Entertainment Budget</h5>
              <p>Reduce from £120 to £100</p>
              <div className="category-tips">
                <span>Consider sharing subscriptions</span>
                <span>Look for free events</span>
              </div>
            </div>
          </div>

          <div className="category-item">
            <span className="category-icon">
              <FaShoppingBag />
            </span>
            <div className="category-content">
              <h5>Shopping Budget</h5>
              <p>Reduce from £200 to £150</p>
              <div className="category-tips">
                <span>Delay non-essential purchases</span>
                <span>Use price comparison tools</span>
              </div>
            </div>
          </div>
        </div>

        <div className="recommendations-actions">
          <button className="btn btn-Apply">Apply Recommendations</button>
          <button className="btn btn-custplan">Customize Plan</button>
        </div>
      </div>

      <div className="spending-anomalies">
        <h4>Unusual Spending Detected</h4>
        <div className="anomaly-item">
          <div className="anomaly-icon warning">
            <FaExclamationTriangle />
          </div>
          <div className="anomaly-content">
            <h5>Transport Spending Increased by 35%</h5>
            <p>
              Your transport expenses this month (£90) are significantly higher
              than your 3-month average (£67).
            </p>
            <button className=" btn-insight">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemoInsight;
