const BASE_URL = "/api/v1/avaliacoes";
import { getToken } from "./authService";


export const fetchFeedback = async (postagemId) => {
  try {
    const response = await fetch(`${BASE_URL}/postagem/${postagemId}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar feedbacks.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

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
