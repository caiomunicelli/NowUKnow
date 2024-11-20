import React from "react";

function ErrorMessage({ message }) {
  return message ? (
    <div
      className="alert alert-danger d-flex align-items-center mt-2"
      role="alert"
    >
      <i className="bi bi-x-circle me-2"></i>
      <span>{message}</span>
    </div>
  ) : null;
}

export default ErrorMessage;
