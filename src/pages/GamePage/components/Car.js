import React from "react";
import "./Car.css";

const Car = props => {
  const { color = "white", rotation } = props;

  const rotationStyle = `rotate(${rotation}deg)`;

  return (
    <div className="car">
      <div className="car-body" style={{ borderColor: color }}>
        <div className="car-body-before" style={{ background: color }} />
        <div className="car-top-back">
          <div className="back-curve"></div>
        </div>
        <div className="car-top-front" style={{ background: color }}>
          <div
            className="car-top-front-before"
            style={{ background: color, borderColor: color }}
          />
          <div className="wind-sheild"></div>
          <div className="car-top-front-after" style={{ background: color }} />
        </div>
        <div className="bonet-front" style={{ background: color }} />
        <div className="stepney"></div>
        <div className="car-body-after" style={{ borderColor: color }} />
      </div>
      <div className="boundary-tyre-cover">
        <div className="boundary-tyre-cover-back-bottom"></div>
        <div className="boundary-tyre-cover-inner"></div>
      </div>
      <div className="tyre-cover-front">
        <div className="boundary-tyre-cover-inner-front"></div>
      </div>
      <div className="base-axcel"></div>
      <div className="front-bumper"></div>
      <div className="tyre" style={{ transform: rotationStyle }}>
        <div className="gap"></div>
      </div>
      <div className="tyre front" style={{ transform: rotationStyle }}>
        <div className="gap"></div>
      </div>
      <div className="car-shadow"></div>
    </div>
  );
};

export default Car;
