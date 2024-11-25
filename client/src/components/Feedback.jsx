import React, { useState, useEffect } from "react";
import {
  fetchFeedback,
  enviarFeedback,
  deletarFeedback,
  atualizarFeedback,
} from "../services/avaliacaoService";
import { useNavigate } from "react-router-dom";
import "./Feedback.css";
import { toast } from "react-toastify";
const Feedback = ({ postagemId, usuario }) => {
  const [feedback, setFeedback] = useState({ positivos: 0, negativos: 0 });
  const [feedbackDado, setFeedbackDado] = useState({
    positivo: false,
    negativo: false,
  });
  const [avaliacao, setAvaliacao] = useState(null);
  const navigate = useNavigate();

  const loadFeedback = async () => {
    try {
      const feedbackData = await fetchFeedback(postagemId);

      let positivos = 0;
      let negativos = 0;
      let usuarioFeedback = null;

      feedbackData.forEach((feedback) => {
        if (feedback.feedback === "positivo") {
          positivos++;
        } else if (feedback.feedback === "negativo") {
          negativos++;
        }

        if (usuario && feedback.usuarioId === usuario.id) {
          usuarioFeedback = feedback;
        }
      });

      setFeedback({ positivos, negativos });

      if (usuario && usuarioFeedback) {
        setFeedbackDado({
          positivo: usuarioFeedback.feedback === "positivo",
          negativo: usuarioFeedback.feedback === "negativo",
        });
        setAvaliacao(usuarioFeedback);
      } else {
        setFeedbackDado({ positivo: false, negativo: false });
        setAvaliacao(null);
      }
    } catch (error) {
      console.error("Erro ao carregar feedbacks:", error);
    }
  };

  const handleFeedback = async (tipo) => {
    if (!usuario) {
      toast.warning("Efetue o login para dar feedback!");
      return;
    }

    try {
      if (avaliacao) {
        if (avaliacao.feedback === tipo) {
          // Remove o feedback se o mesmo tipo já foi dado
          const response = await deletarFeedback(avaliacao.id);
          if (response) {
            setFeedbackDado({ positivo: false, negativo: false });
            setAvaliacao(null);
          }
        } else {
          // Atualiza o feedback para um novo tipo
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
        // Cria um novo feedback
        const response = await enviarFeedback(postagemId, tipo);
        if (response) {
          setFeedbackDado({
            positivo: tipo === "positivo",
            negativo: tipo === "negativo",
          });
          setAvaliacao(response);
        }
      }

      // Atualiza a contagem de feedbacks
      loadFeedback();
    } catch (error) {
      console.error("Erro ao manipular feedback:", error);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [usuario, postagemId]);

  return (
    <div className="nowuknow-feedback">
      <i
        className={`nowuknow-feedback-icon ${
          feedbackDado.positivo
            ? "bi bi-hand-thumbs-up-fill"
            : "bi bi-hand-thumbs-up"
        }`}
        onClick={() => handleFeedback("positivo")}
        title="Curtir"
      ></i>
      <span>{feedback.positivos}</span>

      <i
        className={`nowuknow-feedback-icon ${
          feedbackDado.negativo
            ? "bi bi-hand-thumbs-down-fill"
            : "bi bi-hand-thumbs-down"
        }`}
        onClick={() => handleFeedback("negativo")}
        title="Não curtir"
      ></i>
      <span>{feedback.negativos}</span>
    </div>
  );
};

export default Feedback;
