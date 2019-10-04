import React, { PureComponent } from "react";
import Modal from "../../../components/Modal";
import "./GameEndingModal.css";

class GameEndingModal extends PureComponent {
  render() {
    const { players, show, timeLeft = 0 } = this.props;

    return (
      <Modal show={show}>
        <div style={{ fontSize: "2em", width: "100%" }}>
          <p>Game has ended!</p>
          {show ? renderLeaderboard(players) : null}
          <p style={{ color: "#ccc" }}>Returning to lobby in {timeLeft}...</p>
        </div>
      </Modal>
    );
  }
}

const renderLeaderboard = players => {
  const sortedPlayers = [...players].sort(_comparator);

  return (
    <div style={{ fontSize: "1.5rem", margin: "0 12px" }}>
      {sortedPlayers.map(getPositionElement)}
    </div>
  );
};

const getPositionElement = (p, idx) => {
  return (
    <p className={getPositionColorClass(p.position)}>
      {idx + 1}. {p.username}
    </p>
  );
};

const getPositionColorClass = pos => {
  if (pos === undefined) return "";

  switch (pos) {
    case 0:
      return "ld-first";
    case 1:
      return "ld-second";
    case 2:
      return "ld-third";
    default:
      return "";
  }
};

const _comparator = (p1, p2) => {
  if (p1.position !== undefined && p2.position === undefined) return -1;
  if (p2.position !== undefined && p1.position === undefined) return 1;
  if (p1.position !== null && p2.position === null) return -1;
  if (p2.position !== null && p1.position === null) return 1;
  if (
    (p1.position === undefined || p1.position === null) &&
    (p2.position === undefined || p2.position === null)
  ) {
    return p2.progress - p1.progress;
  } else {
    return p1.position - p2.position;
  }
};

export default GameEndingModal;
