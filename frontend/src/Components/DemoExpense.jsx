import React from "react";
import { FaLock } from "react-icons/fa";

function DemoExpense() {
  return (
    <div className="locked-section">
      <span className="lock-icon">
        <FaLock />
      </span>
      <h3>Add Expense</h3>
      <p>This feature is locked in demo mode.</p>
      <p>Sign up for a full account to track your real expenses.</p>
    </div>
  );
}

export default DemoExpense;
