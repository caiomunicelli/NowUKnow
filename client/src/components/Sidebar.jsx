// Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`nowuknow-sidebar ${isOpen ? "open" : ""}`}>
      <div className="nowuknow-close-btn-div">
        <button onClick={toggleSidebar} className="nowuknow-close-btn">
          <i className="bi bi-list"></i>
        </button>
      </div>
      <ul className="nowuknow-sidebar-nav">
        <li className="nowuknow-sidebar-item">
          <Link
            className={`nowuknow-sidebar-link ${
              isActive("/") ? "nowuknow-active" : ""
            }`}
            to="/"
          >
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
            Sobre
          </Link>
        </li>
        <li className="nowuknow-sidebar-item">
          <Link
            className={`nowuknow-sidebar-link ${
              isActive("/createPost") ? "nowuknow-active" : ""
            }`}
            to="/createPost"
          >
            Criar Postagem
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
