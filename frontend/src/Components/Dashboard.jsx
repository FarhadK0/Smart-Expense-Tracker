import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./DashboardHeader";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import Expense from "./Expense";
import axios from "axios";
import { FileText, Calendar, CheckCircle, Filter } from "lucide-react";
import "../styles/Dashboard.css";
import Budget from "./Budget";
import Insight from "./Insight";
import Report from "./Report";

function RealDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Colors for categories
  const categoryColors = {
    food: "blue",
    transport: "red",
    shopping: "orange",
    bills: "black",
    entertainment: "red",
    health: "green",
    others: "yellow",
  };

  // Normalize text for comparison (trim whitespace and convert to lowercase)
  const normalizeText = (text) => {
    return (text || "").trim().toLowerCase();
  };

  // Get color for category - more robust handling
  const getCategoryColor = (category) => {
    const normalizedCategory = normalizeText(category);
    return (
      categoryColors[normalizedCategory] ||
      getRandomColor(Object.keys(categoryColors).length)
    );
  };

  // Random color for categories
  const getRandomColor = (index) => {
    const colors = ["#4F46E5", "#818CF8", "#93C5FD", "#BFDBFE"];
    return colors[index % colors.length];
  };

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
      setFilteredExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);

      setExpenses(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(res.data);
    } catch (error) {
      console.error("Error fetching budgets:", error.response?.data?.message);
    }
  };
  // Add a new expense
  const addExpense = (newExpense) => {
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    applyDateFilter(updatedExpenses, startDate, endDate);
  };

  // Update an existing expense
  const updateExpense = (updatedExpense) => {
    const updatedExpenses = expenses.map((expense) =>
      expense._id === updatedExpense._id ? updatedExpense : expense
    );
    setExpenses(updatedExpenses);

    applyDateFilter(updatedExpenses, startDate, endDate);
  };

  // Delete an expense
  const deleteExpense = (expenseId) => {
    const updatedExpenses = expenses.filter(
      (expense) => expense._id !== expenseId
    );
    setExpenses(updatedExpenses);

    applyDateFilter(updatedExpenses, startDate, endDate);
  };

  const applyDateFilter = (expenseData, start, end) => {
    if (!start && !end) {
      setFilteredExpenses(expenseData);
      setIsFilterActive(false);
      return;
    }

    const filtered = expenseData.filter((expense) => {
      const expenseDate = new Date(expense.date);

      //if we have start date, check if expense is on or after it
      const afterStart = start ? expenseDate >= new Date(start) : true;

      // If we have an end date, check if expense is on or before it
      const beforeEnd = end ? expenseDate <= new Date(end) : true;

      return afterStart && beforeEnd;
    });

    setFilteredExpenses(filtered);
    setIsFilterActive(true);
  };

  //Handle filter submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    applyDateFilter(expenses, startDate, endDate);
  };

  // Clear filters
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredExpenses(expenses);
    setIsFilterActive(false);
  };

  // Fetch expenses when component mounts
  useEffect(() => {
    fetchExpenses();
    fetchBudgets();
  }, []);

  // Calculate total expenses and remaining balance
  const totalExpenses = filteredExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const totalBudget = budgets.reduce((acc, budget) => acc + budget.amount, 0);
  const remainingBalance = totalBudget - totalExpenses;

  // Prepare data for the charts (overview and categories)
  const expenseOverviewData = filteredExpenses
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((expense) => ({
      name: new Date(expense.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      amount: expense.amount,
    }));

  // Get category totals
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    const category = expense.category || "Other";
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  // Format category data for pie chart
  const expenseCategoriesData = Object.keys(categoryTotals).map(
    (category, index) => ({
      name: category,
      value: categoryTotals[category],
      color: getCategoryColor(category),
      percentage: ((categoryTotals[category] / totalExpenses) * 100).toFixed(1),
    })
  );

  // Group expenses by category for bar chart
  const categoryBarData = Object.keys(categoryTotals)
    .map((category) => ({
      name: category,
      amount: categoryTotals[category],
      fill: getCategoryColor(category),
    }))
    .sort((a, b) => b.amount - a.amount); // Sort from highest to lowest

  // Format the tooltip for the line chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].payload.name}`}</p>
          <p className="amount">{`£${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div>Loading data...</div>;

  return (
    <div className="real-dashboard-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-section">
        <Header />

        {activeTab === "dashboard" && (
          <div className="dashboard-content">
            {/* Date Filter Sectin */}
            <div className="filter-section">
              <form onSubmit={handleFilterSubmit} className="date-filter-form">
                <div className="filter-input">
                  <div className="filter-input-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="filter-input-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  <div className="filter-action">
                    <button type="submit" className="filter-btn">
                      <Filter size={16} />
                      Apply Filter
                    </button>
                    {isFilterActive && (
                      <button
                        type="button"
                        className="clear-filter-btn"
                        onClick={clearFilters}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {isFilterActive && (
                  <div className="filter-status">
                    <span>
                      Showing expenses from {startDate || "all past dated"} to{" "}
                      {endDate || "present"}
                      {filteredExpenses.length === 0 && "No reords found"}
                    </span>
                  </div>
                )}
              </form>
            </div>
            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-icon document-icon">
                  <FileText size={24} color="#4F46E5" />
                </div>
                <div className="summary-details">
                  <span>Total Expenses</span>
                  <h2>£{totalExpenses.toFixed(2)}</h2>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon calendar-icon">
                  <Calendar size={24} color="#818CF8" />
                </div>
                <div className="summary-details">
                  <span>Budget</span>
                  <h2>£{totalBudget}</h2>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon check-icon">
                  <CheckCircle size={24} color="#10B981" />
                </div>
                <div className="summary-details">
                  <span>Remaining Balance</span>
                  <h2>£{remainingBalance.toFixed(2)}</h2>
                </div>
              </div>
            </div>

            {/* Expense Overview Chart */}
            <div className="charts-section">
              <div className="chart-card">
                <h3>Expense Timeline{isFilterActive ? "(Filtered) " : ""}</h3>
                <div className="chart-container">
                  {expenseOverviewData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={expenseOverviewData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis
                          tickFormatter={(value) => `£${value}`}
                          domain={[0, "auto"]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#6366F1"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#6366F1", strokeWidth: 0 }}
                          activeDot={{
                            r: 5,
                            stroke: "#4F46E5",
                            strokeWidth: 1,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="no-data-message">
                      No expense data available for the selected date range.
                    </div>
                  )}
                </div>
              </div>

              {/* Expense Categories Pie Chart */}
              <div className="chart-card">
                <h3>
                  Expense Categories {isFilterActive ? " (Filtered)" : ""}
                </h3>
                <div className="chart-container donut-chart-container">
                  {expenseCategoriesData.length > 0 ? (
                    <>
                      <div className="donut-chart">
                        <PieChart width={180} height={180}>
                          <Pie
                            data={expenseCategoriesData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {expenseCategoriesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <Label
                              content={({ viewBox }) => {
                                const { cx, cy } = viewBox;
                                return (
                                  <text
                                    x={cx}
                                    y={cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="donut-label"
                                  >
                                    <tspan
                                      x={cx}
                                      dy="-0.5em"
                                      fontSize="14"
                                      fontWeight="600"
                                      fill="#1e293b"
                                    >
                                      £{totalExpenses.toFixed(0)}
                                    </tspan>
                                    <tspan
                                      x={cx}
                                      dy="1.5em"
                                      fontSize="10"
                                      fill="#64748b"
                                    >
                                      Total
                                    </tspan>
                                  </text>
                                );
                              }}
                              position="center"
                            />
                          </Pie>
                        </PieChart>
                      </div>
                      <div className="chart-legend">
                        {expenseCategoriesData.map((category, index) => (
                          <div key={index} className="legend-item">
                            <span
                              className="legend-dot"
                              style={{ backgroundColor: category.color }}
                            ></span>
                            <span className="legend-label">
                              {category.name}
                            </span>
                            <span className="legend-value">
                              £{category.value.toFixed(0)} (
                              {category.percentage}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="no-data-message">
                      No category data available for the selected date range.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Category Breakdown Bar Chart  */}
            <div className="chart-card category-breakdown">
              <h3>Category Breakdown{isFilterActive ? " (Filtered)" : ""}</h3>
              <div className="chart-container bar-chart-container">
                {categoryBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={categoryBarData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis
                        type="number"
                        tickFormatter={(value) => `£${value}`}
                      />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip
                        formatter={(value) => [
                          `£${value.toFixed(2)}`,
                          "Amount",
                        ]}
                        labelFormatter={(value) => `Category: ${value}`}
                      />
                      <Legend />
                      <Bar
                        dataKey="amount"
                        name="Amount"
                        radius={[0, 4, 4, 0]}
                        barSize={30}
                      >
                        {categoryBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="no-data-message">
                    No category data available for the selected date range.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "expense" && (
          <Expense
            expenses={expenses}
            setExpenses={setExpenses}
            onAddExpense={addExpense}
            onUpdateExpense={updateExpense}
            onDeleteExpense={deleteExpense}
          />
        )}
        {activeTab === "budgets" && <Budget />}
        {activeTab === "insights" && <Insight />}
        {activeTab === "reports" && (
          <Report getCategoryColorClass={getCategoryColor} />
        )}

        {activeTab === "settings" && (
          <div className="tab-content">Settings</div>
        )}
      </main>
    </div>
  );
}

export default RealDashboard;
