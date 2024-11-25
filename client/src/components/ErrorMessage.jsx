import React from "react";
import "./ErrorMessage.css";
function ErrorMessage({ message }) {
  return message ? (
    <div
      className="alert alert-danger d-flex align-items-center mt-2 nowuknow-error"
      role="alert"
    >
      <i className="bi bi-x-circle me-2"></i>
      <span>{message}</span>
    </div>
  ) : null;
}

export default ErrorMessage;
