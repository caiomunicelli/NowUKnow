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
  control: () => ({
    boxShadow: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: "20px",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    color: isSelected
      ? "var(--nowuknow-text-secondary)"
      : "var(--nowuknow-text-primary)",
    backgroundColor: isFocused
      ? "var(--nowuknow-bg-accent)"
      : "var(--nowuknow-bg-accent-dark)",
    cursor: "pointer",
    ":hover": { backgroundColor: "var(--nowuknow-bg-accent)" },
    padding: "0.75rem 2rem",
    width: "100%",
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
