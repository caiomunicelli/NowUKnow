const BASE_URL = "/api/v1/avaliacoes";
/**
 * Busca os dados de feedback para uma postagem específica.
 * @param {number} postagemId - ID da postagem.
 * @returns {Promise<Object>} - Dados de feedback.
 */
export const getFeedbacks = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/postagem/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar feedbacks.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
        console.error(error);
    };
}

export const createFeedback = async (postagemId, feedback, token) => {
    try {
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

export const deleteFeedback = async (avaliacaoId, token) => {
  try {
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
export const updateFeedback = async (avaliacaoId, novoFeedback, token) => {
    try {
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
