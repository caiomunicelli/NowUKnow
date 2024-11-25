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
import { toast } from "react-toastify";

const Perfil = () => {
  const { nomeusuario } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [perfilUsuarioLogado, setPerfilUsuarioLogado] = useState(false);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const navigate = useNavigate();
  const { isAuthenticated, logout, usuarioLogado } = useAuthContext();

  const formattedDate = (data) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long", // Exibe o mês por extenso
      year: "numeric",
    }).format(new Date(data));
  };

  useEffect(() => {
    const loadUsuario = async () => {
      if (!nomeusuario && !isAuthenticated) {
        toast.error("Por favor, faca login para ver o seu perfil!");
        navigate("/");
        return;
      }
      const dadosUsuario =
        nomeusuario && nomeusuario !== (usuarioLogado && usuarioLogado.usuario)
          ? await fetchUsuarioPorUsername(nomeusuario)
          : await fetchUsuarioLogado();

      setUsuario(dadosUsuario);
      setPerfilUsuarioLogado(
        !nomeusuario || nomeusuario === usuarioLogado.usuario
      );
    };

    loadUsuario();
  }, [nomeusuario, isAuthenticated, navigate, usuarioLogado]);

  const fetchPosts = async () => {
    if (!usuario) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/postagens/allDetails/autor/${usuario.id}`
      );
      const autorPosts = await response.json();
      setPosts(autorPosts);
    } catch (error) {
      console.error("Erro ao carregar posts do autor:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedPosts = async () => {
    if (!usuario) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/postagens/allDetails/feedback/${usuario.id}`
      );
      const likedPostsData = await response.json();
      setLikedPosts(likedPostsData);
    } catch (error) {
      console.error("Erro ao carregar posts curtidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      if (activeTab === "posts") fetchPosts();
      else if (activeTab === "likedPosts") fetchLikedPosts();
    }
  }, [usuario, activeTab]);

  const handleDeletarUsuario = async () => {
    try {
      const resposta = await deletar();
      if (resposta) {
        toast.success("Usuário deletado com sucesso!");
        logout();
        navigate("/");
      } else {
        toast.error("Erro ao deletar usuário.");
      }
    } catch (error) {
      toast.error("Erro ao deletar usuário.");
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
      <div className="perfil-header">
        <h1>
          {perfilUsuarioLogado ? "Meu Perfil" : `Perfil de ${usuario.nome}`}
        </h1>
        {(perfilUsuarioLogado ||
          (usuarioLogado && usuarioLogado.tipo == "Moderador")) && (
          <div className="perfil-acoes">
            <button
              onClick={() => navigate("/editarPerfil", { state: { usuario } })}
              className="editar-btn nowuknow-btn"
            >
              <div className="nowuknow-btn-with-icon">
                <i className="bi bi-pencil"></i>
                <span>Editar Perfil</span>
              </div>
            </button>
            <button
              onClick={handleDeletarUsuario}
              className="deletar-btn nowuknow-btn nowuknow-red"
            >
              <div className="nowuknow-btn-with-icon">
                <i className="bi bi-trash"></i>
                <span>Excluir Perfil</span>
              </div>
            </button>
          </div>
        )}
      </div>
      <div className="perfil-info">
        <Avatar imagem={usuario.imagem} nome={usuario.nome} tamanho={160} />
        <div className="perfil-dados">
          <p>
            <strong>Nome:</strong> {usuario.nome}
          </p>
          <p>
            <strong>Usuário:</strong> {usuario.usuario}
          </p>
          <p>
            <strong>Data de Cadastro:</strong>{" "}
            {formattedDate(usuario.data_criacao)}
          </p>
        </div>
      </div>

      <div className="perfil-tabs">
        <button
          className={`perfil-tab ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          {perfilUsuarioLogado
            ? "Minhas Postagens"
            : `Postagens de ${usuario.nome}`}
        </button>
        {perfilUsuarioLogado && (
          <button
            className={`perfil-tab ${
              activeTab === "likedPosts" ? "active" : ""
            }`}
            onClick={() => setActiveTab("likedPosts")}
          >
            Postagens Curtidas
          </button>
        )}
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : activeTab === "posts" ? (
        posts.length > 0 ? (
          <Feed postagens={posts} />
        ) : (
          <p className="no-posts">Sem postagens.</p>
        )
      ) : likedPosts.length > 0 ? (
        <Feed postagens={likedPosts} />
      ) : (
        <p className="no-posts">Sem postagens curtidas.</p>
      )}
    </div>
  );
};

export default Perfil;
