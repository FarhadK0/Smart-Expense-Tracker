import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Budget.css";
import LoadingSpinner from "../Components/LoadingSpinner";

function Budget() {
  const [budget, setBudget] = useState([]);
  const [expense, setExpense] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly",
    startDate: "",
    endDate: "",
  });

  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  //Fetch budget and expenses

  const fetchBudgetandExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      const budgetRes = await axios.get("http://localhost:5000/api/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const expenseRes = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudget(budgetRes.data);
      setExpense(expenseRes.data);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetandExpense();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start > end) {
      alert("Start Date must be before End Date!");
      return;
    }

    if (start < today) {
      alert("Start Date cannot be in the past");
      return;
    }

    if (end < today) {
      alert("End Date cannot be in the past!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (editingBudget) {
        await axios.put(
          `http://localhost:5000/api/budget/${editingBudget}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Budget update successfully");
      } else {
        await axios.post("http://localhost:5000/api/budget", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Budget created successfully!");
      }
      setEditingBudget(null);
      setFormData({
        category: "",
        amount: "",
        period: "monthly",
        startDate: "",
        endDate: "",
      });
      fetchBudgetandExpense();
    } catch (error) {
      console.error("Error saving budget:", error.response?.data?.message);
      alert("Failed to upadte budget");
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget._id);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      startDate: budget.startDate.split("T")[0],
      endDate: budget.endDate.split("T")[0],
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you wany to delete this budget?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/budget/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Budget deleted successfully");
      fetchBudgetandExpense();
    } catch (error) {
      console.error("Error deleting budget:", error.response?.data?.message);
      alert("Failed to delete budget.");
    }
  };

  const calculateSpent = (budget) => {
    const start = new Date(budget.startDate);
    const end = new Date(budget.endDate);
    const category = budget.category.toLowerCase();
    const spent = expense
      .filter((exp) => {
        const expDate = new Date(exp.date);
        return (
          exp.category?.toLowerCase() === category &&
          expDate >= start &&
          expDate <= end
        );
      })
      .reduce((acc, exp) => acc + exp.amount, 0);
    return spent;
  };

  const getProgressColor = (percentage) => {
    if (percentage <= 50) return "green";
    if (percentage <= 80) return "orange";
    return "red";
  };

  if (loading) return <LoadingSpinner text="Loading Budget..." />;

  return (
    <div className="budget-container">
      <h1>{editingBudget ? "Update Budget" : "Create New Budget"}</h1>

      {/* Budget Form */}
      <form onSubmit={handleSubmit} className="budget-form">
        <div className="budget-form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g Food, Transport"
            required
          />
        </div>

        <div className="budget-form-group">
          <label htmlFor="amount">(£)Amount </label>
          <input
            id="amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="budget-form-group">
          <label htmlFor="period">Period </label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            required
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="budget-form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="budget-form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Form Action */}
        <div className="budget-form-actions">
          <button type="submit" className="budget-submit-btn">
            {editingBudget ? "Update Budget" : "Create Budget"}
          </button>

          {editingBudget && (
            <button
              type="button"
              className="budget-btn-cancel"
              onClick={() => {
                setEditingBudget(null);
                setFormData({
                  category: "",
                  amount: "",
                  period: "monthly",
                  startDate: "",
                  endDate: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List of Budgets */}
      <h2 style={{ marginTop: "2rem" }}> Your Budgets</h2>
      {budget.length > 0 ? (
        <div className="budget-list">
          {budget.map((budget) => {
            const spent = calculateSpent(budget);
            const remaining = budget.amount - spent;
            const percentage = ((spent / budget.amount) * 100).toFixed(1);
            const overLimit = spent > budget.amount;
            return (
              <div key={budget._id} className="budget-item">
                <h3>{budget.category}</h3>
                <p>Budget: £{budget.amount}</p>
                {overLimit ? (
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    Budget is over the limit!
                  </p>
                ) : (
                  <p>Remaining: £{remaining}</p>
                )}
                <div className="budget-progress-bar">
                  <div
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: getProgressColor(percentage),
                      height: "10px",
                      borderRadius: "10px",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    marginTop: "5px",
                    fontSize: "0.85rem",
                    color: "black",
                  }}
                >
                  <div
                    className={`budget-percentage-text ${
                      document.body.classList.contains("dark-mode")
                        ? "dark"
                        : ""
                    }`}
                  >
                    {percentage}% used
                  </div>
                </div>

                <div className="budget-actions">
                  <button onClick={() => handleEdit(budget)}>Edit</button>
                  <button onClick={() => handleDelete(budget._id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No budget found.</p>
      )}
    </div>
  );
}

export default Budget;
