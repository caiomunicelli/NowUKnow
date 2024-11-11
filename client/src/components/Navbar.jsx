import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Importando useLocation
import { useAuthContext } from "../contexts/AuthContext";
import { fetchUsuarioLogado } from "../services/usuarioService";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, logout } = useAuthContext();
  const [usuarioNome, setUsuarioNome] = useState(null);
  const [erro, setErro] = useState(null);

  const location = useLocation(); // Obtendo a localização atual

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const dadosUsuario = await fetchUsuarioLogado();
        setUsuarioNome(dadosUsuario.nome);
      } catch (erro) {
        setErro("Não foi possível carregar os dados do usuário.");
        console.error(erro);
      }
    };

    if (isAuthenticated) {
      fetchUsuario();
    } else {
      setUsuarioNome(null);
    }
  }, [isAuthenticated]);

  // Função para determinar se o link está ativo
  const isActive = (path) => location.pathname === path;

  return (
    <header className="nowuknow-header">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="nowuknow-brand" to="/">
            NowUKnow
          </Link>
          <div className="nowuknow-navbar-middle">
            <form
              className="d-flex mx-auto nowuknow-search-form nowuknow-search"
              role="search"
            >
              <input
                type="search"
                placeholder="Busque algum conteúdo, categoria ou autor"
                aria-label="Search"
              />
              <button className="nowuknow-search-btn" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>
          <div className="nowuknow-navbar" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nowuknow-nav-item">
                {isAuthenticated ? (
                  <Link
                    className={`nowuknow-nav-link ${
                      isActive("/createPost") ? "nowuknow-active" : ""
                    }`}
                    to="/createPost"
                  >
                    Criar Postagem
                  </Link>
                ) : null}
              </li>
              <li className="nowuknow-nav-item">
                <Link
                  className={`nowuknow-nav-link ${
                    isActive("/") ? "nowuknow-active" : ""
                  }`}
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nowuknow-nav-item">
                <Link
                  className={`nowuknow-nav-link ${
                    isActive("/categorias") ? "nowuknow-active" : ""
                  }`}
                  to="/categorias"
                >
                  Categorias
                </Link>
              </li>
              <li className="nowuknow-nav-item">
                {isAuthenticated ? (
                  <span className="nowuknow-nav-link">{usuarioNome}</span>
                ) : null}
              </li>
              <li className="nowuknow-nav-item">
                <Link
                  className={`nowuknow-nav-link ${
                    isActive("/about") ? "nowuknow-active" : ""
                  }`}
                  to="/about"
                >
                  Sobre
                </Link>
              </li>
              <li className="nowuknow-nav-item">
                {isAuthenticated ? (
                  <Link
                    className={`nowuknow-nav-link ${
                      isActive("/login") ? "nowuknow-active" : ""
                    }`}
                    to="#"
                    onClick={logout}
                  >
                    Logout
                  </Link>
                ) : (
                  <Link
                    className={`nowuknow-nav-link ${
                      isActive("/login") ? "nowuknow-active" : ""
                    }`}
                    to="/login"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
