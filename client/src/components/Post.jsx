import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deletaPostagem } from "../services/postagemService";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./";
import Feedback from "./Feedback";
import "./Post.css";

const Post = ({ postagemId, post, comentarioCount, full, onDelete }) => {
  const [postagem, setPostagem] = useState(post);
  const { isAuthenticated, usuarioLogado } = useAuthContext();
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long", // Exibe o mês por extenso
    year: "numeric",
  }).format(new Date(post.postagem_data_publicacao));

  const handleViewContent = () => {
    navigate(`/postagem/${postagemId}`);
  };

  useEffect(() => {
    setUsuario(usuarioLogado);
  }, [usuarioLogado]);

  const handleDeletarPostagem = async () => {
    try {
      const sucesso = await deletaPostagem(postagemId);
      if (sucesso) {
        alert("Postagem excluída com sucesso!");
        onDelete(postagemId); // Notifica o componente pai
      } else {
        alert("Erro ao excluir a postagem.");
      }
    } catch (error) {
      console.error("Erro ao excluir postagem:", error);
    }
  };

  return (
    <div className="nowuknow-post-container">
      <div className="nowuknow-post">
        <h3 className="nowuknow-post-title">{post.postagem_titulo}</h3>
        <p className="nowuknow-post-type">
          {post.postagem_tipo === "Discussao"
            ? post.discussao_tipo === "Duvida"
              ? "Dúvida"
              : post.discussao_tipo
            : post.conteudo_tipo === "Video"
            ? "Vídeo"
            : post.conteudo_tipo === "Material_de_Aprendizado"
            ? "Material de Aprendizado"
            : post.conteudo_tipo}{" "}
          - {post.categoria_nome}
        </p>

        <div className="nowuknow-post-content">
          {post.postagem_tipo === "Discussao" && post.discussao_texto && (
            <p className="nowuknow-post-text">{post.discussao_texto}</p>
          )}

          {post.postagem_tipo === "Conteudo" && (
            <>
              {post.conteudo_tipo === "Video" ? (
                <div className="nowuknow-post-video-container">
                  <video controls className="nowuknow-post-video-player">
                    <source src={post.conteudo_url} type="video/mp4" />
                    Seu navegador não suporta a reprodução de vídeo.
                  </video>
                  {full && (
                    <p className="nowuknow-post-descricao">
                      {post.conteudo_descricao}
                    </p>
                  )}
                </div>
              ) : post.conteudo_tipo === "Material_de_Aprendizado" ? (
                <a
                  href={post.conteudo_url}
                  download
                  className="nowuknow-download-button"
                >
                  Baixar Material
                </a>
              ) : (
                <p>Tipo de conteúdo não suportado.</p>
              )}
            </>
          )}
        </div>
        <div className="nowuknow-post-author">
          <Avatar
            imagem={post.usuario_imagem}
            nome={post.usuario_nome_completo}
            tamanho={40}
          />
          <div className="nowuknow-post-author-info">
            <Link to={`/perfil/${post.usuario_nome}`}>
              <p className="nowuknow-post-user">{post.usuario_nome}</p>
            </Link>
            <p className="nowuknow-post-date">{formattedDate}</p>
          </div>
        </div>

        <div className="nowuknow-post-icons">
          <div className="nowuknow-post-icons-left">
            <Feedback postagemId={postagemId} usuario={usuario} />
            <div className="nowuknow-post-comments">
              <i
                className="bi bi-chat nowuknow-comment-icon"
                onClick={handleViewContent}
                title="Ver comentários"
              ></i>
              <span className="nowuknow-comment-count">{comentarioCount}</span>
            </div>
          </div>
          <div className="nowuknow-post-icons-right">
            {usuarioLogado &&
              (post.usuario_id === usuarioLogado.id ||
                usuarioLogado.tipo === "Moderador") && (
                <div className="nowuknow-post-actions">
                  <i
                    className="bi bi-pencil nowuknow-small-icon"
                    onClick={() =>
                      navigate("/editarPost", { state: { postagem } })
                    }
                  ></i>
                  <i
                    className="bi bi-trash nowuknow-small-icon nowuknow-red-icon"
                    onClick={handleDeletarPostagem}
                  ></i>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
