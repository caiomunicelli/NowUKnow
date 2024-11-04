import React from "react";
import { Link } from "react-router-dom"; // Importando o Link do react-router-dom
import "./Navbar.css";

function Navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand nowuknow-brand" to="/">
            NowUKnow
          </Link>
          <form
            className="d-flex mx-auto nowuknow-search-form nowuknow-search"
            role="search"
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Pesquisar"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Buscar
            </button>
          </form>
          <div className="nowuknow-navbar" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  Minhas Comunidades
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  Meu Perfil
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
