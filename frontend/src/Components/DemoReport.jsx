import React, { useState } from "react";
import {
  FaFileAlt,
  FaUtensils,
  FaCar,
  FaFilm,
  FaShoppingBag,
  FaHome,
  FaLightbulb,
  FaChartLine,
  FaDownload,
} from "react-icons/fa";

function DemoReport({ getCategoryColorClass }) {
  const [reportType, setReportType] = useState("monthly");
  const [dateRange, setDateRange] = useState("current");
  const [selectedFormat, setSelectedFormat] = useState("pdf");

  const monthlyData = [
    { category: "Food", amount: 180, percentage: 22 },
    { category: "Transport", amount: 90, percentage: 11 },
    { category: "Entertainment", amount: 110, percentage: 13 },
    { category: "Shopping", amount: 120, percentage: 15 },
    { category: "Housing", amount: 250, percentage: 30 },
    { category: "Utilities", amount: 70, percentage: 9 },
  ];

  const quarterlyData = [
    { month: "January", income: 2400, expenses: 1800, savings: 600 },
    { month: "February", income: 2400, expenses: 1850, savings: 550 },
    { month: "March", income: 2500, expenses: 1820, savings: 680 },
  ];

  const categoryTrends = [
    { category: "Food", previous: 170, current: 180, change: "+5.9%" },
    { category: "Transport", previous: 110, current: 90, change: "-18.2%" },
    {
      category: "Entertainment",
      previous: 100,
      current: 110,
      change: "+10.0%",
    },
    { category: "Shopping", previous: 140, current: 120, change: "-14.3%" },
  ];

  const getTrendClass = (change) => {
    if (change.startsWith("+")) return "negative-trend";
    if (change.startsWith("-")) return "positive-trend";
    return "";
  };

  const handleDownload = () => {
    alert("Downloads are not available in demo mode.");
  };

  return (
    <div className="reports-container">
      <div className="section-title">
        <span className="title-icon">
          <FaFileAlt />
        </span>
        <h3>Reports & Analytics</h3>
      </div>

      <div className="reports-filters">
        <div className="filter-group">
          <label>Report Type</label>
          <div className="filter-options">
            <button
              className={reportType === "monthly" ? "active" : ""}
              onClick={() => setReportType("monthly")}
            >
              Monthly Summary
            </button>
            <button
              className={reportType === "category" ? "active" : ""}
              onClick={() => setReportType("category")}
            >
              Category Breakdown
            </button>
            <button
              className={reportType === "trends" ? "active" : ""}
              onClick={() => setReportType("trends")}
            >
              Spending Trends
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Time Period</label>
          <div className="filter-options">
            <button
              className={dateRange === "current" ? "active" : ""}
              onClick={() => setDateRange("current")}
            >
              Current Month
            </button>
            <button
              className={dateRange === "previous" ? "active" : ""}
              onClick={() => setDateRange("previous")}
            >
              Previous Month
            </button>
            <button
              className={dateRange === "quarter" ? "active" : ""}
              onClick={() => setDateRange("quarter")}
            >
              Last Quarter
            </button>
          </div>
        </div>
      </div>

      <div className="report-content">
        {/* Monthly Summary */}
        {reportType === "monthly" && (
          <div className="monthly-report">
            <h4>
              Monthly Spending Summary{" "}
              {dateRange === "current"
                ? "(March 2025)"
                : dateRange === "previous"
                ? "(February 2025)"
                : "(Q1 2025)"}
            </h4>

            <div className="report-summary">
              <div className="summary-box">
                <span className="summary-label">Total Income</span>
                <span className="summary-value">£2,500</span>
              </div>
              <div className="summary-box">
                <span className="summary-label">Total Expenses</span>
                <span className="summary-value">£820</span>
              </div>
              <div className="summary-box highlight">
                <span className="summary-label">Total Savings</span>
                <span className="summary-value">£1,680</span>
              </div>
              <div className="summary-box">
                <span className="summary-label">Saving Rate</span>
                <span className="summary-value">67.2%</span>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {reportType === "category" && (
          <div className="category-report">
            <h4>Category Breakdown</h4>
            <div className="category-grid">
              {monthlyData.map((item) => (
                <div className="category-card" key={item.category}>
                  <div
                    className={`category-icon ${getCategoryColorClass(
                      item.category
                    )}`}
                  >
                    {item.category === "Food" && <FaUtensils />}
                    {item.category === "Transport" && <FaCar />}
                    {item.category === "Entertainment" && <FaFilm />}
                    {item.category === "Shopping" && <FaShoppingBag />}
                    {item.category === "Housing" && <FaHome />}
                    {item.category === "Utilities" && <FaLightbulb />}
                  </div>
                  <h5>{item.category}</h5>
                  <div className="category-amount">£{item.amount}</div>
                  <div className="category-percentage">
                    {item.percentage}% of total
                  </div>
                  <div className="category-average">
                    <small>
                      Monthly Avg: £{Math.round(item.amount * 0.95)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spending Trends */}
        {reportType === "trends" && (
          <div className="trends-report">
            <h4>Spending Trends</h4>

            <div className="trends-summary">
              <div className="summary-box">
                <span className="summary-label">Current Spending</span>
                <span className="summary-value">£820</span>
              </div>
              <div className="summary-box">
                <span className="summary-label">Previous Period</span>
                <span className="summary-value">£850</span>
              </div>
              <div className="summary-box highlight positive">
                <span className="summary-label">Change</span>
                <span className="summary-value">-£30 (-3.5%)</span>
              </div>
            </div>

            <table className="trends-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Previous</th>
                  <th>Current</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {categoryTrends.map((item) => (
                  <tr key={item.category}>
                    <td>
                      <span
                        className={`category-dot ${getCategoryColorClass(
                          item.category
                        )}`}
                      ></span>
                      {item.category}
                    </td>
                    <td>£{item.previous}</td>
                    <td>£{item.current}</td>
                    <td className={getTrendClass(item.change)}>
                      {item.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {dateRange === "quarter" && (
              <div className="quarterly-overview">
                <h5>Quarterly Overview</h5>
                <table className="quarterly-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Expenses</th>
                      <th>Savings</th>
                      <th>Saving Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarterlyData.map((item) => (
                      <tr key={item.month}>
                        <td>{item.month}</td>
                        <td>£{item.income}</td>
                        <td>£{item.expenses}</td>
                        <td>£{item.savings}</td>
                        <td>
                          {((item.savings / item.income) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="download-section">
        <h4>Download Report</h4>
        <div className="download-options">
          <div className="format-selector">
            <span>Format:</span>
            <div className="format-buttons">
              {["pdf", "excel", "csv"].map((fmt) => (
                <button
                  key={fmt}
                  className={selectedFormat === fmt ? "active" : ""}
                  onClick={() => setSelectedFormat(fmt)}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-download" onClick={handleDownload}>
            <span className="download-icon">
              <FaDownload />
            </span>{" "}
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default DemoReport;
