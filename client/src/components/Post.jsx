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
            <p className="nowuknow-post-date">Publicado em: {formattedDate}</p>
          </div>
        </div>

        <div className="nowuknow-post-icons">
          <div className="nowuknow-post-icons-left">
            <Feedback postagemId={postagemId} usuario={usuario} />
            <i
              className="bi bi-chat nowuknow-comment-icon"
              onClick={handleViewContent}
              title="Ver comentários"
            ></i>
            <span className="nowuknow-comment-count">{comentarioCount}</span>
          </div>{" "}
          <div className="nowuknow-post-icons-right">
            {usuario && post.usuario_id === usuario.id && (
              <div className="nowuknow-post-actions">
                <i
                  className="bi bi-pencil nowuknow-small-icon"
                  onClick={() =>
                    navigate("/editarPost", { state: { postagem } })
                  }
                ></i>
                <i
                  className="bi bi-trash nowuknow-small-icon nowuknow-red-icon"
                  onClick={() => deletaPostagem(post.postagem_id)}
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
