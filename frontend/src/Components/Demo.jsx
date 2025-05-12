import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaHome,
  FaPlus,
  FaWallet,
  FaCreditCard,
  FaLightbulb,
  FaFileAlt,
  FaExclamationTriangle,
  FaCog,
  FaMusic,
  FaFilm,
  FaShoppingBag,
  FaDumbbell,
} from "react-icons/fa";
import "../Styles/Demo.css";
import DemoHeader from "./Demoheader";
import DemoDashboard from "./DemoDashboard";
import DemoExpense from "./DemoExpense";
import DemoBudget from "./DemoBudget";
import DemoInsight from "./DemoInsight";
import DemoReport from "./DemoReport";

function Demo() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState("January");

  //Sample data of Insigt Shown in Dashbaord
  const insights = [
    {
      Id: 1,
      type: "saving",
      title: "Potentital £120 Monthly Savings",
      description:
        "You could save £120 by ajusting your budget in 5 categories",
      icon: <FaLightbulb />,
      action: "View Details",
      redirectTo: "insight",
    },

    {
      Id: 2,
      type: "alert",
      title: "Entertainment Budget Almost Reached",
      description: "You have spent 90% of your entertainment budget this month",
      icon: <FaExclamationTriangle />,
      action: "Review Budget",
      redirectTo: "budget",
    },

    {
      Id: 3,
      type: "info",
      title: "3 Subscriptions Renewals Next Week",
      description:
        "Netflix, Spotify and Amazon Prime Subscription are due soon",
      icon: <FaCreditCard />,
      action: "Manage Subscription",
      redirectTo: "subscription",
    },
  ];

  //Sample Data of Expense Shown in Dashboard
  const sampleExpenses = [
    {
      id: 1,
      category: "Food",
      description: "Lunch at McDonald's",
      amount: 10,
      date: "2025-01-03",
      paymentMethod: "Credit Card",
      status: "completed",
    },
    {
      id: 2,
      category: "Transport",
      description: "Uber ride to the office",
      amount: 30,
      date: "2025-01-03",
      paymentMethod: "Credit Card",
      status: "completed",
    },
    {
      id: 3,
      category: "Entertainment",
      description: "Spotify subscription",
      amount: 15.5,
      date: "2025-01-03",
      paymentMethod: "Debit Card",
      status: "recurring",
    },
    {
      id: 4,
      category: "Shopping",
      description: "New pair of sneakers",
      amount: 70,
      date: "2025-01-03",
      paymentMethod: "Credit Card",
      status: "completed",
    },
    {
      id: 5,
      category: "Food",
      description: "Dinner at KFC",
      amount: 50.1,
      date: "2025-01-03",
      paymentMethod: "Debit Card",
      status: "pending",
    },
  ];

  const getCategoryClass = (category) => {
    const classes = {
      Food: "category-badge food",
      Transport: "category-badge transport",
      Entertainment: "category-badge entertainment",
      Shopping: "category-badge shopping",
      Health: "category-badge health",
    };
    return classes[category] || "category-badge";
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      completed: "status-badge completed",
      pending: "status-badge pending",
      recurring: "status-badge recurring",
    };
    return classes[status] || "status-badge";
  };

  const getNavIcon = (tab) => {
    const icons = {
      dashboard: <FaHome />,
      expense: <FaPlus />,
      budget: <FaWallet />,
      subscription: <FaCreditCard />,
      insight: <FaLightbulb />,
      report: <FaFileAlt />,
      setting: <FaCog />,
    };
    return icons[tab] || "";
  };

  // New helper for report section
  const getCategoryColorClass = (category) => {
    const classes = {
      Food: "food",
      Transport: "transport",
      Entertainment: "entertainment",
      Shopping: "shopping",
      Housing: "housing",
      Utilities: "utilities",
    };
    return classes[category] || "";
  };

  return (
    <div className="demo-layout">
      <aside className="demo-sidebar">
        <div className="logo">SmartEx</div>
        <nav>
          {["dashboard", "expense", "budget", "insight", "report"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "active" : ""}
              >
                <span className="nav-icon">{getNavIcon(tab)}</span>{" "}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
          <Link to="/">
            <span className="nav-iocn">
              <FaArrowLeft />
            </span>{" "}
            Exit Demo
          </Link>
        </nav>
        <div className="demo-label">Demo Mode</div>
      </aside>

      <main className="demo-main">
        <DemoHeader />
        {activeTab === "dashboard" && (
          <DemoDashboard
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            insights={insights}
            sampleExpenses={sampleExpenses}
            setActiveTab={setActiveTab}
            getCategoryClass={getCategoryClass}
            getStatusBadgeClass={getStatusBadgeClass}
          />
        )}
        {activeTab === "expense" && <DemoExpense />}
        {activeTab === "budget" && <DemoBudget />}

        {activeTab === "insight" && <DemoInsight />}
        {activeTab === "report" && (
          <DemoReport getCategoryColorClass={getCategoryColorClass} />
        )}
      </main>
    </div>
  );
}

export default Demo;
