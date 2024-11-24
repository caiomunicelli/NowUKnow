import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { useAuthContext } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";
import { options, customStyles } from "../utils/selectConfig"; // Importa as configurações
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importa os ícones
import { Login, Avatar } from "./";
import "./Navbar.css";
function Navbar({ isLoginMenuOpen, setIsLoginMenuOpen }) {
  const { isAuthenticated, logout, usuarioLogado, setUsuarioLogado } =
    useAuthContext();
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const narrowWindow = window.innerWidth < 840;
  const [isSidebarOpen, setIsSidebarOpen] = useState(!narrowWindow);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((opt) => opt.default) || options[0]
  );
  const location = useLocation();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleLoginMenu = () => {
    setIsLoginMenuOpen(!isLoginMenuOpen);
  };

  useEffect(() => {
    if (isLoginMenuOpen) {
      setIsLoginMenuOpen(false);
    }
  }, [location]);

  const handleChange = (selected) => {
    setSelectedOption(selected);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário
    if (searchInput.trim()) {
      navigate(
        `/resultados?query=${encodeURIComponent(searchInput.trim())}&filter=${
          selectedOption.value
        }`
      );
    }
  };

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
            onSubmit={handleSearchSubmit}
          >
            <Select
              options={options}
              value={selectedOption}
              onChange={handleChange}
              styles={customStyles}
              isSearchable={false}
              unstyled={true}
              className={`nowuknow-search-select ${
                isFocused ? "nowuknow-search-select-focused" : ""
              }`}
              menuPlacement="auto"
              menuPosition="fixed"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <input
              type="search"
              placeholder="Busque algum conteúdo, categoria ou autor"
              aria-label="Search"
              onChange={(e) => setSearchInput(e.target.value)}
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
            {isAuthenticated && usuarioLogado && (
              <li className="nowuknow-nav-item">
                <Link to="/perfil" className="nowuknow-nav-link">
                  <Avatar
                    imagem={usuarioLogado.imagem}
                    nome={usuarioLogado.nome}
                    tamanho={32}
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
