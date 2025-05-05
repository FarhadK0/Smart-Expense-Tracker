import React from "react";
import {
  FaWallet,
  FaPiggyBank,
  FaExclamationTriangle,
  FaInfo,
  FaUtensils,
  FaCar,
  FaFilm,
  FaShoppingBag,
} from "react-icons/fa";

function DemoBudget() {
  const sampleBudget = [
    {
      name: "Food",
      spent: 180,
      limit: 200,
      icon: <FaUtensils />,
      recommendations: [{ type: "normal", text: "Cook at home more often" }],
    },
    {
      name: "Transport",
      spent: 100,
      limit: 200,
      icon: <FaCar />,
      recommendations: [
        { type: "save", text: "Your transport spending is on track" },
      ],
    },
    {
      name: "Entertainment",
      spent: 100,
      limit: 90,
      icon: <FaFilm />,
      recommendations: [
        { type: "warn", text: "You are close to exceeding your budget" },
      ],
    },
    {
      name: "Shopping",
      spent: 120,
      limit: 200,
      icon: <FaShoppingBag />,
      recommendations: [{ type: "save", text: "Avoid impulse purchases" }],
    },
  ];

  const getFillClass = (spent, limit) => {
    const percent = (spent / limit) * 100;
    if (percent > 90) return "fill alert";
    if (percent > 75) return "fill warning";
    return "fill success";
  };

  const getIconClass = (name) => {
    const classes = {
      Food: "budget-icon food",
      Transport: "budget-icon transport",
      Entertainment: "budget-icon entertainment",
      Shopping: "budget-icon shopping",
    };
    return classes[name] || "budget-icon";
  };

  return (
    <div className="budget-container">
      <div className="section-title">
        <span className="title-icon">
          <FaWallet />
        </span>
        <h3>Budget Status</h3>
      </div>

      <div className="budget-list">
        {sampleBudget.map((cat) => {
          const percent = Math.min((cat.spent / cat.limit) * 100, 100);
          const remaining = cat.limit - cat.spent;
          return (
            <div className="budget-item" key={cat.name}>
              <div className="info">
                <strong>
                  <span className={getIconClass(cat.name)}>{cat.icon}</span>
                  {cat.name}
                </strong>
                <span>
                  £{cat.spent} / £{cat.limit}
                </span>
              </div>
              <div className="bar">
                <div
                  className={getFillClass(cat.spent, cat.limit)}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="budget-detail">
                <div className="budget-meta">
                  <span className={remaining < 0 ? "over-budget" : ""}>
                    {remaining >= 0
                      ? `£${remaining} remaining`
                      : `£${Math.abs(remaining)} over budget`}
                  </span>
                  <span>{percent.toFixed(0)}%</span>
                </div>
                {cat.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className={`budget-recommendation ${rec.type}`}
                  >
                    <span className="recommendation-icon">
                      {rec.type === "save" ? (
                        <FaPiggyBank />
                      ) : rec.type === "warn" ? (
                        <FaExclamationTriangle />
                      ) : (
                        <FaInfo />
                      )}
                    </span>
                    <span className="recommendation-text">{rec.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DemoBudget;
