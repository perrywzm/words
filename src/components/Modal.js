import React from "react";
import "./Modal.css";

const Modal = ({ show, children, style }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={style}>{children}</div>
    </div>
  );
};

export default Modal;
