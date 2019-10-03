import React from "react";
import "./Spinner.css";

const Spinner = ({ show }) => {
  if (!show) return null;

  return (
    <div className="spinner-cover">
      <div className="spinner-container">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="spinner-text">Loading...</div>
      </div>
    </div>
  );
};

export default Spinner;
