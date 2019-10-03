import React from "react";
import Modal from "../../../components/Modal";

const GameEndingModal = ({ show, timeLeft = 0 }) => {
  return (
    <Modal show={show} style={{ fontSize: "2em", width: "50%" }}>
      <p>Game has ended!</p>
      <p style={{ color: "#ccc" }}>Returning to lobby in {timeLeft}...</p>
    </Modal>
  );
};

export default GameEndingModal;
