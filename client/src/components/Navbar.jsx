import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext"; // Usando o contexto para acessar o estado de autenticação
import { fetchUsuarioLogado } from "../services/usuarioService"; // Importando o serviço de usuário
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, logout } = useAuthContext(); // Acessando a função de login e logout via useAuth
  const [usuarioNome, setUsuarioNome] = useState(null); // Estado para armazenar o nome do usuário
  const [erro, setErro] = useState(null); // Para lidar com erros na busca dos dados

  useEffect(() => {
    console.log("Autenticado: ", isAuthenticated);
    const fetchUsuario = async () => {
      try {
        const dadosUsuario = await fetchUsuarioLogado(); // Chama o serviço para obter o usuário
        setUsuarioNome(dadosUsuario.nome); // Define o nome do usuário no estado
      } catch (erro) {
        setErro("Não foi possível carregar os dados do usuário.");
        console.error(erro);
      }
    };

    if (isAuthenticated) {
      fetchUsuario(); // Só busca os dados se o usuário estiver autenticado
    } else {
      setUsuarioNome(null); // Se não estiver autenticado, reseta o nome do usuário
    }
  }, [isAuthenticated]);

  return (
    <header className="nowuknow-header">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand nowuknow-brand" to="/">
            NowUKnow
          </Link>
          <form
            className="d-flex mx-auto nowuknow-search-form nowuknow-search"
            role="search"
          >
            <div>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Busque algum conteúdo, categoria ou autor"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                <i className="bi bi-search"></i> Buscar
              </button>
            </div>
          </form>
          <div className="nowuknow-navbar" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                {isAuthenticated ? (
                  // Se o usuário estiver autenticado, exibe o nome
                  <Link className="nav-link" to="/createPost">
                    Criar Postagem
                  </Link>
                ) : (
                  <></>
                )}
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                {isAuthenticated ? (
                  // Se o usuário estiver autenticado, exibe o nome
                  <span className="nav-link">{usuarioNome}</span>
                ) : (
                  <></>
                )}
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/about">
                  Sobre
                </Link>
              </li>
              <li className="nav-item">
                {isAuthenticated ? (
                  // Se o usuário estiver autenticado, exibe o botão de logout
                  <Link className="nav-link" to="#" onClick={logout}>
                    Logout
                  </Link>
                ) : (
                  // Se o usuário não estiver autenticado, exibe o botão de login
                  <Link className="nav-link" to="/login">
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
