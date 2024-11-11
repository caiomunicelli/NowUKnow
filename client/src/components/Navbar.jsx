// Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { fetchUsuarioLogado } from "../services/usuarioService";
import Sidebar from "./Sidebar"; // Importando Sidebar
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, logout } = useAuthContext();
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controle da sidebar
  const location = useLocation();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const dadosUsuario = await fetchUsuarioLogado();
        setUsuario(dadosUsuario);
      } catch (erro) {
        setErro("Não foi possível carregar os dados do usuário.");
        console.error(erro);
      }
    };

    if (isAuthenticated) {
      fetchUsuario();
    } else {
      setUsuario(null);
    }
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="nowuknow-header">
      <nav className="nowuknow-navbar">
        <div className="nowuknow-navbar-left">
          <button onClick={toggleSidebar} className="nowuknow-menu-btn">
            <i className="bi bi-list"></i>
          </button>
          <Link className="nowuknow-brand" to="/">
            NowUKnow
          </Link>
        </div>
        <div className="nowuknow-navbar-middle">
          <form className="nowuknow-search-form nowuknow-search" role="search">
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
        <div className="nowuknow-navbar-right">
          <ul className="nowuknow-navbar-nav">
            <li className="nowuknow-nav-item">
              {isAuthenticated && usuario ? (
                <Link to="/perfil" className="nowuknow-nav-link">
                  <img
                    src={usuario.imagem}
                    alt="Perfil"
                    className="nowuknow-perfil-icon"
                  />
                </Link>
              ) : (
                <Link className="nowuknow-nav-link" to="/login">
                  Login
                </Link>
              )}
            </li>
            {isAuthenticated && (
              <li className="nowuknow-nav-item">
                <button onClick={logout} className="nowuknow-nav-link">
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </header>
  );
}

export default Navbar;
