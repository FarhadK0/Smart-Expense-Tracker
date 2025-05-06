import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaChartLine,
  FaWallet,
  FaCreditCard,
  FaTimes,
  FaSearch,
  FaCalendarAlt,
  FaFilter,
  FaAngleDown,
} from "react-icons/fa";
import "../Styles/Expense.css";
import LoadingSpinner from "../Components/LoadingSpinner";

function Expense({
  expenses,
  setExpenses,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) {
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
    paymentMethod: "",
    status: "completed",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    type: "all",
    startDate: "",
    endDate: "",
  });

  // Initialize filteredExpenses when expenses change
  useEffect(() => {
    filterExpenses(expenses, searchTerm, dateFilter);
  }, [expenses, searchTerm, dateFilter]);

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Call the parent component's delete function
      onDeleteExpense(id);
    } catch (err) {
      console.error("Error deleting expense:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Filter expenses based on search term and date filters
  const filterExpenses = (expensesData, term, dateFilterParams) => {
    let filtered = [...expensesData];

    // Apply search term filter
    if (term && term.trim() !== "") {
      filtered = filtered.filter((expense) => matchesSearch(expense, term));
    }

    // Apply date filter
    if (dateFilterParams.type !== "all") {
      filtered = filtered.filter((expense) =>
        matchesDateFilter(expense, dateFilterParams)
      );
    }

    setFilteredExpenses(filtered);
  };

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterExpenses(expenses, value, dateFilter);
  };

  // Check if expense matches search term
  const matchesSearch = (expense, term) => {
    if (!term) return true;

    const searchLower = term.toLowerCase();
    return (
      expense.category.toLowerCase().includes(searchLower) ||
      expense.description.toLowerCase().includes(searchLower) ||
      expense.amount.toString().includes(searchLower) ||
      (expense.paymentMethod &&
        expense.paymentMethod.toLowerCase().includes(searchLower)) ||
      expense.status.toLowerCase().includes(searchLower) ||
      new Date(expense.date)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchLower)
    );
  };

  const calculateOverallTotal = () => {
    return expenses
      .reduce((sum, expense) => sum + expense.amount, 0)
      .toFixed(2);
  };

  const calculateFilteredTotal = () => {
    return filteredExpenses
      .reduce((sum, expense) => sum + expense.amount, 0)
      .toFixed(2);
  };

  // Check if expense matches date filter
  const matchesDateFilter = (expense, dateFilterParams) => {
    const expenseDate = new Date(expense.date);
    const today = new Date();

    switch (dateFilterParams.type) {
      case "today":
        return expenseDate.toDateString() === today.toDateString();

      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        return expenseDate.toDateString() === yesterday.toDateString();
      }

      case "thisWeek": {
        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return expenseDate >= startOfWeek;
      }

      case "thisMonth": {
        return (
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getFullYear() === today.getFullYear()
        );
      }

      case "lastMonth": {
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);
        return (
          expenseDate.getMonth() === lastMonth.getMonth() &&
          expenseDate.getFullYear() === lastMonth.getFullYear()
        );
      }

      case "thisYear": {
        return expenseDate.getFullYear() === today.getFullYear();
      }

      case "custom": {
        if (!dateFilterParams.startDate && !dateFilterParams.endDate)
          return true;

        const start = dateFilterParams.startDate
          ? new Date(dateFilterParams.startDate)
          : new Date(0);
        let end = dateFilterParams.endDate
          ? new Date(dateFilterParams.endDate)
          : new Date();

        // Set end date to end of day
        if (dateFilterParams.endDate) {
          end = new Date(dateFilterParams.endDate);
          end.setHours(23, 59, 59, 999);
        }

        return expenseDate >= start && expenseDate <= end;
      }

      default:
        return true;
    }
  };

  // Handle date filter changes
  const handleDateFilterChange = (type) => {
    let newDateFilter = { ...dateFilter, type };

    // Reset custom dates if not using custom filter
    if (type !== "custom") {
      newDateFilter.startDate = "";
      newDateFilter.endDate = "";
    }

    setDateFilter(newDateFilter);
    filterExpenses(expenses, searchTerm, newDateFilter);

    // Close date filter dropdown if not selecting custom
    if (type !== "custom") {
      setShowDateFilter(false);
    }
  };

  // Handle custom date range changes
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    const updatedDateFilter = { ...dateFilter, [name]: value };
    setDateFilter(updatedDateFilter);
    filterExpenses(expenses, searchTerm, updatedDateFilter);
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);

    const minAllowedDate = new Date();
    minAllowedDate.setFullYear(today.getFullYear() - 1);
    minAllowedDate.setHours(0, 0, 0, 0);

    if (!formData.date) {
      alert("Please select a date.");
      setLoading(false);
      return;
    }

    if (isNaN(selectedDate.getTime())) {
      alert("Invalid date format. Please select a valid date.");
      setLoading(false);
      return;
    }

    if (selectedDate > today) {
      alert("Selected date cannot be in the future.");
      setLoading(false);
      return;
    }

    if (selectedDate < minAllowedDate) {
      alert("Selected date cannot be more than 1 year in the past.");
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      let response;
      if (editingId) {
        response = await axios.put(
          `http://localhost:5000/api/expenses/${editingId}`,
          dataToSend,
          config
        );

        // Call the parent component's update function
        onUpdateExpense(response.data);
      } else {
        response = await axios.post(
          "http://localhost:5000/api/expenses",
          dataToSend,
          config
        );

        // Call the parent component's add function
        onAddExpense(response.data);
      }

      // Reset form and hide it after successful submission
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving expense:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit expense
  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setFormData({
      ...expense,
      date: expense.date.split("T")[0] || "",
    });
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      category: "",
      description: "",
      amount: "",
      date: "",
      paymentMethod: "",
      status: "completed",
    });
    setEditingId(null);
  };

  // Toggle form and reset if necessary
  const toggleForm = () => {
    if (showForm) {
      // If form is visible and we're closing it, reset the form
      resetForm();
    }
    setShowForm(!showForm);
  };

  // Calculate totals from filtered expenses
  const calculateTotal = () => {
    return filteredExpenses
      .reduce((sum, expense) => sum + expense.amount, 0)
      .toFixed(2);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setDateFilter({
      type: "all",
      startDate: "",
      endDate: "",
    });
    setFilteredExpenses(expenses);
  };

  // Handle outside click for date filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDateFilter && !event.target.closest(".date-filter-container")) {
        setShowDateFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateFilter]);

  // Get active filter text
  const getActiveFilterText = () => {
    switch (dateFilter.type) {
      case "all":
        return "All Dates";
      case "today":
        return "Today";
      case "yesterday":
        return "Yesterday";
      case "thisWeek":
        return "This Week";
      case "thisMonth":
        return "This Month";
      case "lastMonth":
        return "Last Month";
      case "thisYear":
        return "This Year";
      case "custom":
        return "Custom Range";
      default:
        return "All Dates";
    }
  };

  const getFilteredRangeLabel = () => {
    switch (dateFilter.type) {
      case "today":
        return "Today's Expenses";
      case "yesterday":
        return "Yesterday's Expenses";
      case "thisWeek":
        return "Thi Week Expenses";
      case "thisMonth":
        return "This Month Expenses";
      case "lastMonth":
        return "Last Month Expenses";
      case "thisYear":
        return "This Year Expenses";
      case "custom":
        return "Custom Range Expenses";
      default:
        return "Filteres Range Expenses";
    }
  };

  if (loading) return <LoadingSpinner text="Loading Expenses..." />;

  const hasActiveFilters = searchTerm !== "" || dateFilter.type !== "all";

  return (
    <div className="expense-container">
      {/* Header section with summary */}
      <div className="expense-header">
        <div className="header-top">
          <h1 className="expense-title">Expense Tracker</h1>
          <div className="header-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="search-clear"
                  onClick={() => {
                    setSearchTerm("");
                    filterExpenses(expenses, "", dateFilter);
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <div className="date-filter-container">
              <button
                className={`date-filter-button ${
                  dateFilter.type !== "all" ? "active" : ""
                }`}
                onClick={() => setShowDateFilter(!showDateFilter)}
              >
                <FaCalendarAlt />
                <span>{getActiveFilterText()}</span>
                <FaAngleDown />
              </button>

              {showDateFilter && (
                <div className="date-filter-dropdown">
                  <div className="date-filter-options">
                    <button
                      className={dateFilter.type === "all" ? "active" : ""}
                      onClick={() => handleDateFilterChange("all")}
                    >
                      All Dates
                    </button>
                    <button
                      className={dateFilter.type === "today" ? "active" : ""}
                      onClick={() => handleDateFilterChange("today")}
                    >
                      Today
                    </button>
                    <button
                      className={
                        dateFilter.type === "yesterday" ? "active" : ""
                      }
                      onClick={() => handleDateFilterChange("yesterday")}
                    >
                      Yesterday
                    </button>
                    <button
                      className={dateFilter.type === "thisWeek" ? "active" : ""}
                      onClick={() => handleDateFilterChange("thisWeek")}
                    >
                      This Week
                    </button>
                    <button
                      className={
                        dateFilter.type === "thisMonth" ? "active" : ""
                      }
                      onClick={() => handleDateFilterChange("thisMonth")}
                    >
                      This Month
                    </button>
                    <button
                      className={
                        dateFilter.type === "lastMonth" ? "active" : ""
                      }
                      onClick={() => handleDateFilterChange("lastMonth")}
                    >
                      Last Month
                    </button>
                    <button
                      className={dateFilter.type === "thisYear" ? "active" : ""}
                      onClick={() => handleDateFilterChange("thisYear")}
                    >
                      This Year
                    </button>
                    <button
                      className={dateFilter.type === "custom" ? "active" : ""}
                      onClick={() => handleDateFilterChange("custom")}
                    >
                      Custom Range
                    </button>
                  </div>

                  {dateFilter.type === "custom" && (
                    <div className="custom-date-range">
                      <div className="date-range-input">
                        <label>Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={dateFilter.startDate}
                          onChange={handleDateRangeChange}
                        />
                      </div>
                      <div className="date-range-input">
                        <label>End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={dateFilter.endDate}
                          onChange={handleDateRangeChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={toggleForm}
              className={`btn-toggle-form ${showForm ? "active" : ""}`}
            >
              {showForm ? (
                <>
                  <FaTimes /> Close Form
                </>
              ) : (
                <>
                  <FaPlus /> Add Expense
                </>
              )}
            </button>
          </div>
        </div>
        <div className="expense-summary">
          <div className="summary-card">
            <div className="card-icon">
              <FaCreditCard />
            </div>
            <p className="summary-label">Total Expenses</p>
            <p className="summary-value">£{calculateOverallTotal()}</p>
          </div>
          <div className="summary-card">
            <div className="card-icon">
              <FaChartLine />
            </div>
            <p className="summary-label">{getFilteredRangeLabel()}</p>
            <p className="summary-value">£{calculateFilteredTotal()}</p>
          </div>
          <div className="summary-card">
            <div className="card-icon">
              <FaWallet />
            </div>
            <p className="summary-label">Total Entries</p>
            <p className="summary-value">{filteredExpenses.length}</p>
            {hasActiveFilters}
          </div>
        </div>
      </div>

      {/* Form section - conditionally displayed */}
      {showForm && (
        <div className="expense-form-container">
          <h2 className="form-title">
            {editingId ? "Edit Expense" : "Add New Expense"}
          </h2>
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g., Food, Transport"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Brief description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <input
                  type="text"
                  name="paymentMethod"
                  placeholder="e.g., Cash, Credit Card"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="recurring">Recurring</option>
                </select>
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update Expense" : "Save Expense"}
              </button>
              <button
                type="button"
                onClick={toggleForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses table */}
      <div className="expense-table-container">
        <div className="table-header">
          <h2 className="table-title">Your Expenses</h2>
          {hasActiveFilters && (
            <button className="btn-clear-filters" onClick={clearAllFilters}>
              <FaTimes /> Clear All Filters
            </button>
          )}
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            {hasActiveFilters ? (
              <>
                <p>No expenses match your filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="btn btn-secondary mt-20"
                >
                  Clear All Filters
                </button>
              </>
            ) : (
              <p>
                No expenses recorded yet. Click "Add Expense" to get started.
              </p>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>
                      {new Date(expense.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="expense-category">{expense.category}</td>
                    <td>{expense.description}</td>
                    <td className="expense-amount">
                      £{expense.amount.toFixed(2)}
                    </td>
                    <td>{expense.paymentMethod}</td>
                    <td>
                      <span className={`status-badge status-${expense.status}`}>
                        {expense.status.charAt(0).toUpperCase() +
                          expense.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="btn-action btn-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteExpense(expense._id)}
                          className="btn-action btn-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Expense;
