import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { fetchUsuarioLogado } from "../services/usuarioService";
import Sidebar from "./Sidebar";
import { Login } from "./";
import "./Navbar.css";

function Navbar({ isLoginMenuOpen, setIsLoginMenuOpen }) {
  const { isAuthenticated, logout } = useAuthContext();
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleLoginMenu = () => {
    setIsLoginMenuOpen(!isLoginMenuOpen);
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const dadosUsuario = await fetchUsuarioLogado();
        setUsuario(dadosUsuario);
      } catch (erro) {
        setErro("Não foi possível carregar os dados do usuário.");
        setUsuario(null);
        logout();
        console.error(erro);
      }
    };

    if (isAuthenticated) {
      fetchUsuario();
    } else {
      setUsuario(null);
    }
  }, [isAuthenticated]);

  // Fecha o menu de login sempre que a rota mudar
  useEffect(() => {
    if (isLoginMenuOpen) {
      setIsLoginMenuOpen(false);
    }
  }, [location]);

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
          <form
            className="nowuknow-search-form nowuknow-search hide-on-resize-2"
            role="search"
          >
            <input
              type="search"
              placeholder="Busque algum conteúdo, categoria ou autor"
              aria-label="Search"
            />
            <button className="nowuknow-btn-icon" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
        <div className="nowuknow-navbar-right">
          <ul className="nowuknow-navbar-nav">
            {isAuthenticated && (
              <Link
                to="/createPost"
                className="nowuknow-nav-link nowuknow-create-post-btn"
              >
                <i className="bi bi-plus nowuknow-plus"></i>{" "}
                <span className="hide-on-resize">Criar Postagem</span>
              </Link>
            )}
            {isAuthenticated && usuario && (
              <li className="nowuknow-nav-item">
                <Link to="/perfil" className="nowuknow-nav-link">
                  <img
                    src={usuario.imagem}
                    alt="Perfil"
                    className="nowuknow-perfil-icon"
                  />
                </Link>
              </li>
            )}
            <li className="nowuknow-nav-item">
              {isAuthenticated ? (
                <button onClick={logout} className="nowuknow-nav-link">
                  Logout
                </button>
              ) : (
                <button onClick={toggleLoginMenu} className="nowuknow-nav-link">
                  Login
                </button>
              )}
            </li>
          </ul>
          {isLoginMenuOpen && (
            <Login onClose={() => setIsLoginMenuOpen(false)} />
          )}
        </div>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </nav>
    </header>
  );
}

export default Navbar;
