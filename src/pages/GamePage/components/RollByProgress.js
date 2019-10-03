import React from "react";
import _ from "lodash";
import Car from "./Car";
import PositionBar from './PositionBar';
import "./RollByProgress.css";

const carOffset = 170;

const RollByProgress = props => {
  const ref = React.useRef();
  const textRef = React.useRef();
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const _updateWidth = () => {
      setWidth(prevWidth => ref.current.clientWidth - carOffset);
      console.log(ref.current.clientWidth - carOffset);
    };
    const updateWidth = _.debounce(_updateWidth, 250);

    _updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const { itsYou, name, progress, wheelRadius, color, position } = props;

  const getTextOffset = () => {
    if (!textRef.current) return 0;

    return Math.min(
      0,
      width + carOffset - (progress * width + textRef.current.clientWidth)
    );
  };

  let rotation;
  if (width !== 0) {
    rotation = progress * (width / (2 * Math.PI * wheelRadius)) * 360;
  } else {
    rotation = 0;
  }

  return (
    <div ref={ref} className="rollbyprogress-container">
      <div className="car-container" style={{ marginLeft: progress * width }}>
        <div
          ref={textRef}
          style={{
            color: itsYou ? "#fcba03" : "white",
            zIndex: 99,
            marginBottom: "1.25em",
            marginLeft: getTextOffset(),
            textAlign: "center",
            whiteSpace: "nowrap",
            transition: "0.4s all linear"
          }}
        >
          {name + (itsYou ? " (You)" : "")}
        </div>
        <Car color={color} rotation={rotation} />
      </div>
      <PositionBar position={position} />
    </div>
  );
};

export default RollByProgress;
