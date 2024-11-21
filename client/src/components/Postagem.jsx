import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { Comentario, NovoComentario } from "../components/";
import "./Postagem.css";

const Postagem = () => {
  const { id } = useParams();
  const [comentarios, setComentarios] = useState([]);
  const [postagem, setPostagem] = useState(null);
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [loadingPostagem, setLoadingPostagem] = useState(false);
  const { isAuthenticated } = useAuthContext();

  const fetchComentariosByPostagem = async () => {
    setLoadingComentarios(true);
    try {
      const response = await fetch(`/api/v1/comentarios/allComments/${id}`);
      const postagemComentarios = await response.json();
      setComentarios(postagemComentarios);
    } catch (error) {
      console.error("Erro ao carregar comentários da postagem:", error);
    } finally {
      setLoadingComentarios(false);
    }
  };

  const fetchPostagemDetails = async () => {
    setLoadingPostagem(true);
    try {
      const response = await fetch(`/api/v1/postagens/postagem/${id}`);
      const postagemData = await response.json();
      setPostagem(postagemData);
    } catch (error) {
      console.error("Erro ao carregar detalhes da postagem:", error);
    } finally {
      setLoadingPostagem(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostagemDetails();
      fetchComentariosByPostagem();
    }
  }, [id]);

  return (
    <div className="nowuknow-comentarios-postagem">
      {loadingPostagem ? (
        <p>Carregando detalhes da postagem...</p>
      ) : postagem ? (
        <div className="nowuknow-comentarios-post-container">
          <div className="nowuknow-post">
            <h3 className="nowuknow-post-title">{postagem.postagem_titulo}</h3>
            <p className="nowuknow-post-user">Por: {postagem.usuario_nome}</p>
            <p className="nowuknow-post-date">
              Publicado em:{" "}
              {new Date(postagem.postagem_data_publicacao).toLocaleDateString(
                "pt-BR"
              )}
            </p>

            {postagem.postagem_tipo === "Discussao" &&
              postagem.discussao_texto && (
                <p className="nowuknow-post-text">{postagem.discussao_texto}</p>
              )}

            {postagem.postagem_tipo === "Conteudo" && (
              <>
                {postagem.conteudo_tipo === "Video" ? (
                  <div className="nowuknow-post-video-container">
                    <video controls className="nowuknow-post-video-player">
                      <source src={postagem.conteudo_url} type="video/mp4" />
                      Seu navegador não suporta a reprodução de vídeo.
                    </video>
                  </div>
                ) : postagem.conteudo_tipo === "Material_de_Aprendizado" ? (
                  <a
                    href={postagem.conteudo_url}
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
      ) : (
        <p>Postagem não encontrada.</p>
      )}

      <h3 className="nowuknow-title-comentario">Comentários</h3>

      {isAuthenticated && (
        <NovoComentario
          postagemId={id}
          onComentarioCriado={fetchComentariosByPostagem}
        />
      )}

      {loadingComentarios ? (
        <p>Carregando comentários...</p>
      ) : comentarios.length > 0 ? (
        comentarios.map((comentario) => (
          <Comentario
            key={comentario.comentario_id}
            comentario={comentario}
            fetchComentariosByPostagem={fetchComentariosByPostagem}
          />
        ))
      ) : (
        <p className="no-comentarios">
          Que tal ser o primeiro a deixar seu comentário?
        </p>
      )}
    </div>
  );
};

export default Postagem;
