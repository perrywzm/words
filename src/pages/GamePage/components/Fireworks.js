import React from "react";
import "./Fireworks.css";

const Fireworks = () => {
  console.log(123);
  return (
    <div>
      <div className="blauw">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="paars">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="rood">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="oranje">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="geel">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="groen">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="blauw2">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="paars2">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="rood2">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="oranje2">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="geel2">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
      <div className="groen2">
        {[...Array(22)].map((i, idx) => (
          <div className="punt" key={idx} />
        ))}
      </div>
    </div>
  );
};

export default Fireworks;
