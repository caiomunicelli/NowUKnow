import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className={"nowuknow-sidebar"}>
      <ul className="nowuknow-sidebar-nav">
        <li className="nowuknow-sidebar-item">
          <Link
            className={`nowuknow-sidebar-link ${
              isActive("/") ? "nowuknow-active" : ""
            }`}
            to="/"
          >
            <i className="bi bi-house-door nowuknow-sidebar-icon"></i>{" "}
            {/* Ícone de casa para Home */}
            Home
          </Link>
        </li>
        <li className="nowuknow-sidebar-item">
          <Link
            className={`nowuknow-sidebar-link ${
              isActive("/categorias") ? "nowuknow-active" : ""
            }`}
            to="/categorias"
          >
            <i className="bi bi-grid nowuknow-sidebar-icon"></i>{" "}
            {/* Ícone de grade para Categorias */}
            Categorias
          </Link>
        </li>
        <li className="nowuknow-sidebar-item">
          <Link
            className={`nowuknow-sidebar-link ${
              isActive("/about") ? "nowuknow-active" : ""
            }`}
            to="/about"
          >
            <i className="bi bi-info-circle nowuknow-sidebar-icon"></i>{" "}
            {/* Ícone de informação para Sobre */}
            Sobre
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
