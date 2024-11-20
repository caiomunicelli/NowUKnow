import React, { useState, useEffect } from "react";
import { fetchUsuarioLogado, deletar } from "../../services/usuarioService";
import { useAuthContext } from "../../contexts/AuthContext";
import "./Post.css";

const Post = ({ post }) => {
  const [usuario, setUsuario] = useState(null);

  const formattedDate = new Date(
    post.postagem_data_publicacao
  ).toLocaleDateString("pt-BR");

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

  return (
    <div className="nowuknow-post-container">
      <div className="nowuknow-post">
        <h3 className="nowuknow-post-title">{post.postagem_titulo}</h3>
        <p className="nowuknow-post-user">Por: {post.usuario_nome}</p>
        <p className="nowuknow-post-date">Publicado em: {formattedDate}</p>

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

        {usuario && post.autor_id === usuario.id && (
          <div className="nowuknow-post-actions">
            <button
              className="nowuknow-delete-button"
              onClick={() => deletar(post.id)}
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
