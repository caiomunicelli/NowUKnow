import React from "react";
import "./Post.css";

const Post = ({
  title,
  username,
  date,
  text,
  postType,
  contentType,
  contentUrl,
}) => {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");

  return (
    <div className="nowuknow-post-container">
      <div className="nowuknow-post">
        <h3 className="nowuknow-post-title">{title}</h3>
        <p className="nowuknow-post-user">Por: {username}</p>
        <p className="nowuknow-post-date">Publicado em: {formattedDate}</p>

        {postType === "Discussao" && text && (
          <p className="nowuknow-post-text">{text}</p>
        )}

        {postType === "Conteudo" && (
          <>
            {contentType === "Video" ? (
              <div className="nowuknow-post-video-container">
                <video controls className="nowuknow-post-video-player">
                  <source src={contentUrl} type="video/mp4" />
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
              </div>
            ) : contentType === "Material_de_Aprendizado" ? (
              <a
                href={contentUrl}
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
    </div>
  );
};

export default Post;
