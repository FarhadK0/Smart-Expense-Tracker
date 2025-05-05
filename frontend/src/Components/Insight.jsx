import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Award,
  AlertCircle,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import LoadingSpinner from "../Components/LoadingSpinner";
import "../Styles/Insight.css";

function Insight() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Fetch insights from backend
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/insight", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch insights");
        }

        const data = await response.json();
        setInsight(data.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load insights");
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const formatMonthlyTrendData = () => {
    if (!insight.monthlyTotals) return [];

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return Object.entries(insight.monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, amount]) => {
        const [year, month] = monthKey.split("-");
        const displayMonth = `${monthNames[parseInt(month) - 1]} ${year}`;
        return {
          month: displayMonth,
          spending: amount,
        };
      });
  };
  if (loading) return <LoadingSpinner text="Loading Insights..." />;

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <AlertCircle size={32} className="error-icon" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insight-container">
      <div className="section-header">
        <Lightbulb className="section-icon" />
        <h2>Financial Insight</h2>
      </div>

      <div className="insight-cards">
        {/* Top Spending Card */}
        <div className="insight-card card-blue">
          <div className="card-header">
            <h4>Top Spending</h4>
            <Award className="card-icon blue-icon" />
          </div>
          <div className="card-value">{insight.topCategory}</div>
        </div>

        {/*Lowest Spending Card */}
        <div className="insight-card card-green">
          <div className="card-header">
            <h4>Lowest Spending</h4>
            <Award className="card-icon green-icon" />
          </div>
          <div className="card-value">{insight.lowestCategory}</div>
        </div>

        {/* Monthly Average */}
        <div className="insight-card card-purple">
          <div className="card-header">
            <h4>Monthly Average</h4>
            <Calendar className="card-icon purple-icon" />
          </div>
          <div className="card-value">£{insight.avgMonthlyExpense}</div>
        </div>
      </div>

      {/* Smart Saving Tips */}
      <div className="saving-tips-container">
        <div className="saving-tips-header">
          <Lightbulb className="section-icon" />
          <h3>Smart Saving Tips</h3>
        </div>
        <div className="saving-tips-grid">
          {insight.smartTips.map((tip, index) => (
            <div key={index} className="tip-card">
              <div className="tip-icon-container">
                <Lightbulb size={16} className="tip-icon" />
              </div>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Chart */}
      <div className="spending-trend-container">
        <h3>Spending Trend Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatMonthlyTrendData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="spending"
              stroke="#4a90e2"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Insight;
