import React, { useState, useEffect } from "react";
import { fetchFeedback, enviarFeedback } from "../services/avaliacaoService";
import { fetchUsuarioLogado } from "../services/usuarioService";
import { deletaPostagem } from "../services/postagemService";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Post.css";

const Post = ({ postagemId, post, comentarioCount, }) => {
  const [usuario, setUsuario] = useState(null);
  const [postagem, setPostagem] = useState(post);
  const { isAuthenticated } = useAuthContext();
  const [feedback, setFeedback] = useState({ positivos: 0, negativos: 0 });
  const [erro, setErro] = useState(null);
  const [feedbackDado, setFeedbackDado] = useState({ positivo: false, negativo: false });
  const navigate = useNavigate();

  const formattedDate = new Date(post.postagem_data_publicacao).toLocaleDateString("pt-BR");


  const handleViewContent = () => {
    navigate(`/postagem/${postagemId}`);
  };
  useEffect(() => {
    setPostagem(post);
    const loadUsuario = async () => {
      try {
        const dadosUsuario = await fetchUsuarioLogado();
        setUsuario(dadosUsuario);
      } catch (error) {
        setErro("Erro ao carregar os dados do usuário.");
        console.error(error);
      }
    };

    const loadFeedback = async () => {
      try {
        const feedbackData = await fetchFeedback(post.postagem_id);
        setFeedback(feedbackData);
      } catch (error) {
        console.error("Erro ao carregar feedbacks:", error);
      }
    };

    if (isAuthenticated) {
      loadUsuario();
    }
    loadFeedback();
  }, [isAuthenticated, post.postagem_id]);

  const handleFeedback = async (tipo) => {
    try {
      const feedbackValue = tipo === "positivo" ? "positivo" : "negativo";
      await enviarFeedback(post.postagem_id, feedbackValue);

      // Desabilitar os botões após o feedback ser dado
      if (feedbackValue === "positivo") {
        setFeedbackDado({ ...feedbackDado, positivo: true });
      } else {
        setFeedbackDado({ ...feedbackDado, negativo: true });
      }

      const feedbackData = await fetchFeedback(post.postagem_id);
      setFeedback(feedbackData); // Atualiza a contagem de feedbacks após o envio
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
    }
  };

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
              <a href={post.conteudo_url} download className="nowuknow-download-button">
                Baixar Material
              </a>
            ) : (
              <p>Tipo de conteúdo não suportado.</p>
            )}
          </>
        )}
        <span className="nowuknow-comment-count">{comentarioCount}</span>
        <i
          className="bi bi-chat nowuknow-comment-icon"
          onClick={handleViewContent}
          title="Ver comentários"
        ></i>
        <button
            className="btn btn-outline-success"
            onClick={() => handleFeedback("positivo")}
            disabled={feedbackDado.positivo} // Desabilitar o botão após feedback positivo
          >
            <i className="bi bi-hand-thumbs-up"></i> {feedback.positivos}
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => handleFeedback("negativo")}
            disabled={feedbackDado.negativo} // Desabilitar o botão após feedback negativo
          >
            <i className="bi bi-hand-thumbs-down"></i> {feedback.negativos}
          </button>

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
