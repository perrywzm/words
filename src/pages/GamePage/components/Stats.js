import React from "react";

const Stats = ({ showStats, wpm, errorCount }) => {
  return (
    <div
      style={{
        fontSize: "2em",
        fontWeight: "bold",
        display: "flex",
        flexFlow: "row",
        margin: "1em 0"
      }}
    >
      <div style={{ flex: 1 }}>
        {showStats ? "WPM:  " + wpm : "Start typing to get WPM"}
      </div>
      {showStats ? (
        <div style={{ flex: 1, color: "#AA0000" }}>
          Errors: {errorCount}
        </div>
      ) : null}
    </div>
  );
};

export default Stats;
