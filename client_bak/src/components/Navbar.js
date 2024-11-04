import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <a className="navbar-brand nowuknow-brand" href="#">
          NowUKnow
        </a>
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
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Minhas Comunidades
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Meu Perfil
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login">
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
