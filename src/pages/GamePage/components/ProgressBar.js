import React from "react";
import Car from "./Car";

const ProgressBar = ({ name, progress }) => {
  return (
    <div
      style={{
        margin: "40px 0",
        height: "60px",
        marginLeft: `${progress * 100}%`,
        transition: "margin-left 0.4s"
      }}
    >
      
    </div>
  );
};

export default ProgressBar;
