import React from "react";
import { LoaderCircle } from "lucide-react";
import "../Styles/LoadingSpinner.css";

function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <LoaderCircle className="spinner-icon" size={48} />
        <p>{text}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
