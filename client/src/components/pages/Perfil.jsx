import React, { useState, useEffect } from "react";
import { fetchUsuarioLogado, deletar } from "../../services/usuarioService";
import Feed from "../Feed";
import "./Perfil.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  // Função para carregar os dados do usuário logado
  useEffect(() => {
    const loadUsuario = async () => {
      try {
        const dadosUsuario = await fetchUsuarioLogado();
        setUsuario(dadosUsuario);
      } catch (error) {
        setErro("Erro ao carregar os dados do usuário.");
        console.error(error);
      }
    };

    loadUsuario();
  }, []);

  // Função para carregar os posts do autor
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

  // Função para deletar o usuário
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
      <h1>Meu Perfil</h1>
      <div className="perfil-info">
        <img
          src={usuario.imagem}
          alt={usuario.nome}
          className="perfil-imagem"
        />
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
      <button onClick={handleDeletarUsuario} className="deletar-btn">
        Deletar Conta
      </button>

      <div className="perfil-posts">
        <h2>Minhas Postagens</h2>
        {loadingPosts ? (
          <p>Carregando posts...</p>
        ) : posts.length > 0 ? (
          <Feed postagens={posts} />
        ) : (
          <p className="no-posts">Você ainda não possui postagens.</p>
        )}
      </div>
    </div>
  );
};

export default Perfil;
