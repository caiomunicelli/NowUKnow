const BASE_URL = "/api/v1/avaliacoes";
import { getToken } from "./authService";

/**
 * Busca os dados de feedback para uma postagem específica.
 * @param {number} postagemId - ID da postagem.
 * @returns {Promise<Object>} - Dados de feedback.
 */
export const fetchFeedback = async (id) => {
  try {
    console.log(id);
    const response = await fetch(`${BASE_URL}/postagem/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar feedbacks.");
    }
    const data = await response.json();
    console.log(JSON.stringify(data));
    console.log(response);
    return data;
  } catch (error) {
        console.error(error);
    };
}

export const enviarFeedback = async (postagemId, feedback) => {
    try {
      const token = getToken(); // Obtém o token do authService
      console.log(JSON.stringify({ postagemId, feedback }));
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ postagemId, feedback }),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao enviar feedback.");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

export const deletarFeedback = async (avaliacaoId) => {
  try {
    const token = getToken(); // Obtém o token do authService
    const response = await fetch(`${BASE_URL}/${avaliacaoId}`, {
      method: "DELETE",
      headers: {
        "x-access-token": token,
      },
    });

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
      const token = getToken();
      const response = await fetch(`${BASE_URL}/${avaliacaoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ feedback: novoFeedback }),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao atualizar feedback.");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
