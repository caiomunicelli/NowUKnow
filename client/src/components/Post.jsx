import React, { useState, useEffect } from "react";
import { fetchFeedback, enviarFeedback, deletarFeedback,atualizarFeedback } from "../services/avaliacaoService";
import { fetchUsuarioLogado } from "../services/usuarioService";
import { deletaPostagem } from "../services/postagemService";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Post.css";

const Post = ({ postagemId, post, comentarioCount }) => {
  const [usuario, setUsuario] = useState(null);
  const [postagem, setPostagem] = useState(post);
  const [avaliacao, setAvaliacao] = useState(null);
  const { isAuthenticated } = useAuthContext();
  const [feedback, setFeedback] = useState({ positivos: 0, negativos: 0 });
  const [erro, setErro] = useState(null);
  const [feedbackDado, setFeedbackDado] = useState({ positivo: false, negativo: false });
  const navigate = useNavigate();

  const formattedDate = new Date(post.postagem_data_publicacao).toLocaleDateString("pt-BR");

  const handleViewContent = () => {
    navigate(`/postagem/${postagemId}`);
  };

  const loadFeedback = async (usuario, postagemId) => {
    if (!usuario) return; // Garante que o usuário esteja definido antes de continuar
  
    try {
      const feedbackData = await fetchFeedback(postagemId);
  
      // Inicializa contadores de feedbacks
      let positivos = 0;
      let negativos = 0;
      let usuarioFeedback = null;
  
      // Verifica o feedback dado pelo usuário e calcula os totais
      feedbackData.forEach((feedback) => {
        if (feedback.feedback === "positivo") {
          positivos++;
        } else if (feedback.feedback === "negativo") {
          negativos++;
        }
  
        // Verifica se o feedback pertence ao usuário logado
        if (feedback.usuarioId === usuario.id) {
          usuarioFeedback = feedback.feedback; // Armazena o tipo de feedback dado pelo usuário
        }
      });
  
      // Atualiza o estado com as somas de feedbacks
      setFeedback({ positivos, negativos });
  
      // Atualiza o estado do feedback dado pelo usuário
      if (usuarioFeedback) {
        setFeedbackDado({
          positivo: usuarioFeedback === "positivo",
          negativo: usuarioFeedback === "negativo",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar feedbacks:", error);
    }
  };
  
  // UseEffect para carregar o usuário
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
  
    if (isAuthenticated) {
      loadUsuario();
    }
  }, [isAuthenticated]);
  
  // UseEffect para carregar feedback
  useEffect(() => {
    if (usuario) {
      loadFeedback(usuario, postagemId);
    }
  }, [usuario, postagemId]);
  

  const handleFeedback = async (tipo) => {
    try {
      if (avaliacao) {
        if (avaliacao.feedback === tipo) {
          // Se o feedback selecionado for o mesmo já dado, remove o feedback
          const response = await deletarFeedback(avaliacao.id);
          if (response) {
            setFeedbackDado({ positivo: false, negativo: false });
            setAvaliacao(null);
            console.log("Avaliação removida:", response);
          }
        } else {
          // Se o feedback selecionado for diferente, atualiza o feedback existente
          const response = await atualizarFeedback(avaliacao.id, tipo);
          if (response) {
            setFeedbackDado({
              positivo: tipo === "positivo",
              negativo: tipo === "negativo",
            });
            avaliacao.feedback = tipo;
            setAvaliacao(avaliacao);
          }
        }
      } else {
        // Caso não exista uma avaliação, cria um novo feedback
        const response = await enviarFeedback(post.postagem_id, tipo);
        if (response) {
          setFeedbackDado({
            positivo: tipo === "positivo",
            negativo: tipo === "negativo",
          });
          setAvaliacao(response);
          console.log("Avaliação enviada:", response);
        }
      }
  
      // Atualiza a contagem de feedbacks
      loadFeedback(usuario, post.postagem_id);
    } catch (error) {
      console.error("Erro ao manipular feedback:", error);
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

        <div className="nowuknow-feedback">
          <i
            className={`bi bi-hand-thumbs-up nowuknow-feedback-icon ${
              feedbackDado.positivo ? "active" : ""
            }`}
            onClick={() => handleFeedback("positivo")}
            title="Curtir"
          ></i>
          
          <span>{feedback.positivos}</span>

          <i
            className={`bi bi-hand-thumbs-down nowuknow-feedback-icon ${
              feedbackDado.negativo ? "active" : ""
            }`}
            onClick={() => handleFeedback("negativo")}
            title="Não curtir"
          ></i>
          <span>{feedback.negativos}</span>
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
