import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUsuarioLogado } from "../services/usuarioService";
import { deletaPostagem } from "../services/postagemService";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./";
import Feedback from "./Feedback";
import "./Post.css";

const Post = ({ postagemId, post, comentarioCount }) => {
  const [usuario, setUsuario] = useState(null);
  const [postagem, setPostagem] = useState(post);
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const formattedDate = new Date(
    post.postagem_data_publicacao
  ).toLocaleDateString("pt-BR");

  useEffect(() => {
    const loadUsuario = async () => {
      try {
        const dadosUsuario = await fetchUsuarioLogado();
        setUsuario(dadosUsuario);
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
      }
    };

    if (isAuthenticated) {
      loadUsuario();
    }
  }, [isAuthenticated]);

  const handleViewContent = () => {
    navigate(`/postagem/${postagemId}`);
  };

  return (
    <div className="nowuknow-post-container">
      <div className="nowuknow-post">
        <h3 className="nowuknow-post-title">{post.postagem_titulo}</h3>
        <Link to={`/perfil/${post.usuario_nome}`}>
          <p className="nowuknow-post-user">Por: {post.usuario_nome}</p>
        </Link>

        <Avatar
          imagem={post.usuario_imagem}
          nome={post.usuario_nome_completo}
          tamanho={40}
        />
        <p className="nowuknow-post-date">Publicado em: {formattedDate}</p>

        {post.postagem_tipo === "Discussao" && post.discussao_texto && (
          <p className="nowuknow-post-text">{post.discussao_texto}</p>
        )}
        <div className="nowuknow-feedback">
          <Feedback postagemId={postagemId} usuario={usuario} />
          <i
            className="bi bi-chat nowuknow-comment-icon"
            onClick={handleViewContent}
            title="Ver comentários"
          ></i>
          <span className="nowuknow-comment-count">{comentarioCount}</span>
        </div>
        {usuario && post.usuario_id === usuario.id && (
          <div className="nowuknow-post-actions">
            <button
              className="nowuknow-delete-button"
              onClick={() => deletaPostagem(post.postagem_id)}
            >
              Excluir
            </button>
            <button
              className="nowuknow-edit-button"
              onClick={() => navigate("/editarPost", { state: { postagem } })}
            >
              Editar Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
