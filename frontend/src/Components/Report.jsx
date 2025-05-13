import React, { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaUtensils,
  FaCar,
  FaFilm,
  FaShoppingBag,
  FaHome,
  FaLightbulb,
  FaDownload,
} from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { utils as XLSXUtils, writeFile as XLSXWriteFile } from "xlsx";
import "../Styles/Report.css";
import LoadingSpinner from "../Components/LoadingSpinner";

function Report({ getCategoryColorClass }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState("monthly");
  const [selectedFormat, setSelectedFormat] = useState("pdf");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load report");
        const data = await res.json();
        setReportData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const getTrendClass = (change) => {
    if (change.startsWith("+")) return "negative-trend";
    if (change.startsWith("-")) return "positive-trend";
    return "";
  };

  const handleDownload = () => {
    const element = document.getElementById("report-download-content");

    if (selectedFormat === "pdf") {
      const options = {
        margin: 0.5,
        filename: "SmartExpense_Report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      html2pdf().from(element).set(options).save();
    } else if (selectedFormat === "csv" || selectedFormat === "excel") {
      const rows = reportData.categoryBreakdown.map((item) => ({
        Category: item.category,
        Amount: item.amount,
        Percentage: item.percentage,
      }));

      const ws = XLSXUtils.json_to_sheet(rows);
      const wb = XLSXUtils.book_new();
      XLSXUtils.book_append_sheet(wb, ws, "Category Breakdown");

      const filename =
        selectedFormat === "csv"
          ? "SmartExpense_Report.csv"
          : "SmartExpense_Report.xlsx";
      XLSXWriteFile(wb, filename);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Report..." />;
  if (error) return <p className="error">{error}</p>;
  if (!reportData) return null;

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
      </div>

      <div id="report-download-content">
        <div className="report-content">
          {reportType === "monthly" && (
            <div className="monthly-report">
              <h4>Monthly Spending Summary</h4>
              <div className="report-summary">
                <div className="summary-box">
                  <span className="summary-label">Total Income</span>
                  <span className="summary-value">
                    £{reportData.monthlySummary.income}
                  </span>
                </div>
                <div className="summary-box">
                  <span className="summary-label">Monthly Expenses</span>
                  <span className="summary-value">
                    £{reportData.monthlySummary.expenses}
                  </span>
                </div>
                <div className="summary-box highlight">
                  <span className="summary-label">Total Savings</span>
                  <span className="summary-value">
                    £{reportData.monthlySummary.savings}
                  </span>
                </div>
                <div className="summary-box">
                  <span className="summary-label">Saving Rate</span>
                  <span className="summary-value">
                    {reportData.monthlySummary.savingRate}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {reportType === "category" && (
            <div className="category-report">
              <h4>Category Breakdown</h4>
              <div className="category-grid">
                {reportData.categoryBreakdown.map((item) => (
                  <div className="category-card" key={item.category}>
                    <div
                      className={`category-icon ${getCategoryColorClass(
                        item.category
                      )}`}
                    >
                      {item.category.toLowerCase().includes("bill") ? (
                        <FaLightbulb />
                      ) : item.category.toLowerCase().includes("rent") ? (
                        <FaHome />
                      ) : item.category.toLowerCase().includes("food") ? (
                        <FaUtensils />
                      ) : item.category.toLowerCase().includes("transport") ? (
                        <FaCar />
                      ) : item.category
                          .toLowerCase()
                          .includes("entertainment") ? (
                        <FaFilm />
                      ) : item.category.toLowerCase().includes("shopping") ? (
                        <FaShoppingBag />
                      ) : item.category.toLowerCase().includes("utility") ||
                        item.category.toLowerCase().includes("electric") ? (
                        <FaLightbulb />
                      ) : (
                        <FaFileAlt /> // default/fallback icon
                      )}
                    </div>
                    <h5>{item.category}</h5>
                    <div className="category-amount">£{item.amount}</div>
                    <div className="category-percentage">
                      {item.percentage}% of total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportType === "trends" && (
            <div className="trends-report">
              <h4>Spending Trends</h4>
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
                  {reportData.categoryTrends.map((item) => (
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
                  {reportData.quarterlyData.map((item) => (
                    <tr key={item.month}>
                      <td>{item.month}</td>
                      <td>£{item.income}</td>
                      <td>£{item.expenses}</td>
                      <td>£{item.saving}</td>
                      <td>{((item.saving / item.income) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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

export default Report;
