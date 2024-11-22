import { getToken } from "./authService";
import { createFeedback, getFeedbacks, deleteFeedback, updateFeedback } from "../api/avaliacaoApi";

/**
 * Busca os dados de feedback para uma postagem específica.
 * @param {number} postagemId - ID da postagem.
 * @returns {Promise<Object>} - Dados de feedback.
 */
export const fetchFeedback = async (id) => {
  try {
    const data = await getFeedbacks(id);
    return data;
  } catch (error) {
        console.error(error);
    };
}

export const enviarFeedback = async (postagemId, feedback) => {
    try {
      const token = getToken(); // Obtém o token do authService
      const data = await createFeedback(postagemId, feedback, token);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

export const deletarFeedback = async (avaliacaoId) => {
  try {
    const token = getToken(); // Obtém o token do authService
    const response = await deleteFeedback(avaliacaoId, token);
    if (!response) {
      throw new Error("Erro ao deletar feedback.");
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const atualizarFeedback = async (avaliacaoId, novoFeedback) => {
    try {
      const token = getToken(); // Obtém o token do authService
      const data = await updateFeedback(avaliacaoId, novoFeedback, token);
      if (!data) {
        throw new Error("Erro ao atualizar feedback.");
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
