import React, { useState, useEffect } from "react";
import {
  fetchUsuarioLogado,
  deletar,
  fetchUsuarioPorUsername,
} from "../../services/usuarioService";
import Feed from "../Feed";
import { Avatar } from "../";
import "./Perfil.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const Perfil = () => {
  const { nomeusuario } = useParams(); // Captura o nomeusuario da URL
  const [usuario, setUsuario] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout, username } = useAuthContext();

  // Carrega os dados do usuário logado ou do perfil acessado
  useEffect(() => {
    const loadUsuario = async () => {
      try {
        let dadosUsuario = null;
        console.log(username);
        if (nomeusuario && nomeusuario !== username) {
          console.log("Nome de usuario", nomeusuario);
          // Busca o perfil pelo nome de usuário (parâmetro da URL)
          dadosUsuario = await fetchUsuarioPorUsername(nomeusuario);
          setUsuarioLogado(false);
        } else {
          if (isAuthenticated) {
            // Busca o perfil do usuário logado
            dadosUsuario = await fetchUsuarioLogado();
            setUsuarioLogado(true);
          } else {
            navigate("/login");
          }
        }
        setUsuario(dadosUsuario);
      } catch (error) {
        setErro("Erro ao carregar os dados do usuário.");
        console.error(error);
      }
    };

    loadUsuario();
  }, [nomeusuario, isAuthenticated, navigate]);

  // Carrega os posts do autor
  useEffect(() => {
    const fetchPostsByAutor = async () => {
      if (!usuario) return;
      setLoadingPosts(true);
      try {
        const response = await fetch(
          `/api/v1/postagens/allDetails/autor/${usuario.id}`
        );
        const autorPosts = await response.json();
        setPosts(autorPosts);
      } catch (error) {
        console.error("Erro ao carregar posts do autor:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPostsByAutor();
  }, [usuario]);

  // Deleta o usuário logado
  const handleDeletarUsuario = async () => {
    try {
      const resposta = await deletar();
      if (resposta) {
        alert("Usuário deletado com sucesso!");
        logout();
        navigate("/");
      } else {
        alert("Erro ao deletar usuário. (handleDeletarUsuario)");
      }
    } catch (error) {
      setErro("Erro ao deletar o usuário. (handleDeletarUsuario)");
      console.error(error);
    }
  };

  if (erro) {
    return <div>{erro}</div>;
  }

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="perfil-container">
      <h1>{usuarioLogado ? "Meu Perfil" : `Perfil de ${usuario.nome}`}</h1>
      <div className="perfil-info">
        <Avatar imagem={usuario.imagem} nome={usuario.nome} tamanho={100} />
        <div className="perfil-dados">
          <p>
            <strong>Nome:</strong> {usuario.nome}
          </p>
          <p>
            <strong>Usuário:</strong> {usuario.usuario}
          </p>
          <p>
            <strong>Email:</strong> {usuario.email}
          </p>
          <p>
            <strong>Data de Criação:</strong>{" "}
            {new Date(usuario.data_criacao).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Botões de edição e exclusão apenas para o perfil do usuário logado */}
      {usuarioLogado && (
        <div className="perfil-acoes">
          <button onClick={handleDeletarUsuario} className="deletar-btn">
            Deletar Conta
          </button>
          <button
            onClick={() => navigate("/editarPerfil", { state: { usuario } })}
            className="editar-btn"
          >
            Editar Perfil
          </button>
        </div>
      )}

      <div className="perfil-posts">
        <h2>
          {usuarioLogado ? "Minhas Postagens" : `Postagens de ${usuario.nome}`}
        </h2>
        {loadingPosts ? (
          <p>Carregando posts...</p>
        ) : posts.length > 0 ? (
          <Feed postagens={posts} />
        ) : (
          <p className="no-posts">
            {usuarioLogado
              ? "Você ainda não possui postagens."
              : `${usuario.nome} ainda não possui postagens.`}
          </p>
        )}
      </div>
    </div>
  );
};

export default Perfil;
