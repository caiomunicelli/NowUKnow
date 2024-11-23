import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importa os ícones

export const options = [
  {
    value: "autor",
    label: (
      <div className="nowuknow-select-container">
        <i className="bi bi-person"></i>
        <span>Autor</span>
      </div>
    ),
    icon: "bi bi-person",
    default: false,
  },
  {
    value: "conteudo",
    label: (
      <div className="nowuknow-select-container">
        <i className="bi bi-file-earmark-text"></i>
        <span>Conteúdo</span>
      </div>
    ),
    icon: "bi bi-file-earmark-text",
    default: true,
  },
  {
    value: "categoria",
    label: (
      <div className="nowuknow-select-container">
        <i className="bi bi-folder2"></i>
        <span>Categoria</span>
      </div>
    ),
    icon: "bi bi-folder2",
    default: false,
  },
];

export const customStyles = {
  control: (base) => ({
    ...base,
    minWidth: "50px",
    height: "36px",
    border: "1px solid #ccc",
    borderRadius: "25px",
    boxShadow: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    color: isSelected ? "var(--nowuknow-text-muted)" : "#333",
    backgroundColor: isFocused ? "#f0f0f0" : "#fff",
    cursor: "pointer",
    ":hover": { backgroundColor: "#f8f9fa" },
  }),
  singleValue: (base) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    display: "none",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};
