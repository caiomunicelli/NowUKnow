import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { useAuthContext } from "../contexts/AuthContext";
import { fetchUsuarioLogado } from "../services/usuarioService";
import Sidebar from "./Sidebar";
import { Login } from "./";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importa os ícones
import "./Navbar.css";

const options = [
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


function Navbar({ isLoginMenuOpen, setIsLoginMenuOpen }) {
  const { isAuthenticated, logout } = useAuthContext();
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((opt) => opt.default) || options[0]
  );
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleLoginMenu = () => {
    setIsLoginMenuOpen(!isLoginMenuOpen);
  };

  const customStyles = {
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

  useEffect(() => {
    if (isLoginMenuOpen) {
      setIsLoginMenuOpen(false);
    }
  }, [location]);

  const handleChange = (selected) => {
    setSelectedOption(selected);
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
          >
            <Select
              options={options.map((option) => ({
                value: option.value,
                label: option.label ,
              }))}
              value={selectedOption}
              onChange={handleChange}
              styles={customStyles}
              isSearchable={false}
            />
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
          {isLoginMenuOpen && <Login onClose={() => setIsLoginMenuOpen(false)} />}
        </div>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </nav>
    </header>
  );
}

export default Navbar;
