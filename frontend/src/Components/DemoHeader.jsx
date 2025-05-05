import React from "react";
import { useNavigate } from "react-router-dom";

function DemoHeader() {
  const navigate = useNavigate();

  return (
    <header className="demo-header">
      <div className="header-content">
        <h2>
          Welcome To SamartEx <span>(Demo)</span>
        </h2>
        <p>
          This is a full-featured preview. All data is sample and read-only.
        </p>
      </div>

      <div className="header-actions">
        <button className="btn btn-help">Help</button>
        <button className="btn btn-signup" onClick={() => navigate("/signup")}>
          Signup
        </button>
      </div>
    </header>
  );
}

export default DemoHeader;
