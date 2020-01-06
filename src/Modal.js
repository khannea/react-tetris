import React from "react";
import "./Modal.scss";

function Modal({ message, active }) {
  return (
    <div id="modal" className={active === true ? "open" : ""}>
      <div className="mask"></div>
      <div className="container auto">
        <div className="message"> Press the new key </div>
        <button className="close">&times;</button>
      </div>
    </div>
  );
}

export default Modal;
