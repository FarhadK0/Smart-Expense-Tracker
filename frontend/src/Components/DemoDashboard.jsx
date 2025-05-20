import React from "react";
import {
  FaChartPie,
  FaCreditCard,
  FaChartLine,
  FaLightbulb,
  FaWallet,
  FaLightbulb as FaIdea,
  FaFileAlt,
} from "react-icons/fa";

function DemoDashboard({
  selectedMonth,
  setSelectedMonth,
  sampleExpenses,
  getStatusBadgeClass,
}) {
  return (
    <div className="dashboard-container">
      <div className="section-title">
        <span className="title-icon">
          <FaChartPie />
        </span>
        <h3>Dashboard Overview</h3>
        <div className="section-actions">
          <select
            className="select-month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="January">January 2025</option>
            <option value="February">February 2025</option>
            <option value="March">March 2025</option>
          </select>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-col-3">
          <div className="card primary">
            <div className="card-icon primary">
              <FaCreditCard />
            </div>
            <h4>Total Expenses</h4>
            <p>£820</p>
          </div>
        </div>
        <div className="grid-col-3">
          <div className="card success">
            <div className="card-icon success">
              <FaChartLine />
            </div>
            <h4>Monthly Budget</h4>
            <p>£1200</p>
          </div>
        </div>
        <div className="grid-col-3">
          <div className="card warning">
            <div className="card-icon warning">
              <FaLightbulb />
            </div>
            <h4>Financial Score</h4>
            <p>88</p>
          </div>
        </div>
        <div className="grid-col-3">
          <div className="card purple">
            <div className="card-icon purple">
              <FaWallet />
            </div>
            <h4>Savings</h4>
            <p>£380</p>
            <span className="card-trend positive">+£40 this month</span>
          </div>
        </div>
      </div>

      <div className="section-title">
        <span className="title-icon">
          <FaFileAlt />
        </span>
        <h3>Recent Expenses</h3>
        <div className="section-actions">
          <button className="btn btn-see-all">See All</button>
        </div>
      </div>

      <div className="table-container">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {sampleExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.category}</td>
                <td className="description-cell">
                  <div>{expense.description}</div>
                  <div className="payment-method">{expense.paymentMethod}</div>
                </td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>
                  <span className={getStatusBadgeClass(expense.status)}>
                    {expense.status}
                  </span>
                </td>
                <td className="amount">£{expense.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DemoDashboard;
