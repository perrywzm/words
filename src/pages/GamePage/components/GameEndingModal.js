import React from "react";
import Modal from "../../../components/Modal";

const GameEndingModal = ({ show, timeLeft = 0 }) => {
  return (
    <Modal show={show}>
      <div style={{ fontSize: "2em", width: "100%" }}>
        <p>Game has ended!</p>
        <p style={{ color: "#ccc" }}>Returning to lobby in {timeLeft}...</p>
      </div>
    </Modal>
  );
};

export default GameEndingModal;
