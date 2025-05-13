import React, { useEffect, useState } from "react";
import { Lightbulb, Calendar, Award, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import LoadingSpinner from "../Components/LoadingSpinner";
import "../Styles/Insight.css";

function Insight() {
  const [insight, setInsight] = useState(null);
  const [aiInsight, setAiInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchRegularInsights = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/insight", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch insights");
        const data = await response.json();
        setInsight(data.data);
      } catch (err) {
        setError("Failed to load insights");
      } finally {
        setLoading(false);
      }
    };

    const fetchAIInsights = async () => {
      const cachedAI = localStorage.getItem("aiInsight");
      if (cachedAI) {
        setAiInsight(cachedAI);
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/insight/ai", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAiInsight(data.data);
        }
      } catch (err) {
        console.error("Failed to load AI insights.");
      }
    };

    fetchRegularInsights();
    fetchAIInsights();
  }, []);

  const formatMonthlyTrendData = () => {
    if (!insight?.monthlyTotals) return [];
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
        return {
          month: `${monthNames[parseInt(month) - 1]} ${year}`,
          spending: amount,
        };
      });
  };

  if (loading) return <LoadingSpinner text="Loading Insights..." />;
  if (error) {
    return (
      <div className="insight-error-container">
        <div className="insight-error-content">
          <AlertCircle size={32} className="insight-error-icon" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insight-main-container">
      <div className="insight-section-header">
        <Lightbulb className="insight-section-icon" />
        <h2>Financial Insight</h2>
      </div>

      <div className="insight-summary-cards">
        <div className="insight-summary-card insight-card-blue">
          <div className="insight-card-header">
            <h4>Top Spending</h4>
            <Award className="insight-card-icon insight-blue-icon" />
          </div>
          <div className="insight-card-value">{insight.topCategory}</div>
        </div>

        <div className="insight-summary-card insight-card-green">
          <div className="insight-card-header">
            <h4>Lowest Spending</h4>
            <Award className="insight-card-icon insight-green-icon" />
          </div>
          <div className="insight-card-value">{insight.lowestCategory}</div>
        </div>

        <div className="insight-summary-card insight-card-purple">
          <div className="insight-card-header">
            <h4>Monthly Average</h4>
            <Calendar className="insight-card-icon insight-purple-icon" />
          </div>
          <div className="insight-card-value">£{insight.avgMonthlyExpense}</div>
        </div>
      </div>

      <div className="insight-tips-container">
        <div className="insight-tips-header">
          <Lightbulb className="insight-section-icon" />
          <h3>Smart Saving Tips</h3>
        </div>
        <div className="insight-tips-grid">
          {insight.smartTips.map((tip, index) => (
            <div key={index} className="insight-tip-card">
              <div className="insight-tip-icon-container">
                <Lightbulb size={16} className="insight-tip-icon" />
              </div>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="insight-trend-container">
        <h3>Spending Trend Over Time</h3>
        <div className="insight-chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={formatMonthlyTrendData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#555555" }}
                axisLine={{ stroke: "#cccccc" }}
              />
              <YAxis
                tick={{ fill: "#555555" }}
                axisLine={{ stroke: "#cccccc" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #dddddd",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              />
              <Line
                type="monotone"
                dataKey="spending"
                stroke="#4a90e2"
                strokeWidth={3}
                dot={{ r: 5, fill: "#4a90e2" }}
                activeDot={{ r: 7, stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {aiInsight && (
        <div className="insight-ai-section">
          <div className="insight-ai-header">
            <Lightbulb className="insight-section-icon" />
            <h3>AI-Based Financial Advice</h3>
          </div>
          <div className="insight-ai-content">
            {aiInsight.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Insight;
