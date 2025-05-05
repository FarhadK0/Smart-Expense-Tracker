import React from "react";
import "../Styles/MainSection.css";
import { useNavigate } from "react-router-dom";
function MainSection() {
  const navigate = useNavigate();
  return (
    <section className="main-content">
      <div className="content-text">
        <h1>
          Manage Your Expense Easily With
          <br />
          <span className="gradient-text">SmartEx</span>
        </h1>
        <p>
          Track your spending, set budgets, and manage finances in one place.
          Take control of your financial future with our inuitive expense
          tracking solution
        </p>
        <button className="cta-btn" onClick={() => navigate("/demo")}>
          Try Demo
        </button>
      </div>
    </section>
  );
}

export default MainSection;
