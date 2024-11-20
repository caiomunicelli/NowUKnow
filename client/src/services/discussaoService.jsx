// client/src/services/postagemService.js
import {
  createDiscussao,
  getDiscussaoByPost,
  updateDiscussao,
} from "../api/discussaoApi.jsx";
import { getToken } from "./authService";

export const publicaDiscussao = async (discussao) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await createDiscussao(discussao, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao publicar Discussão no service");
    return response;
  } catch (error) {
    console.error("Erro ao publicar Discussão no service:", error);
    throw error;
  }
};

export const pegaDiscussao = async (postagem_id) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await getDiscussaoByPost(postagem_id, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao obter Discussão no service");
    return response;
  } catch (error) {
    console.error("Erro ao obter Discussão no service:", error);
    throw error;
  }
};

export const editaDiscussao = async (discussao, discussao_id) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await updateDiscussao(discussao, discussao_id, token); // Chama a API de cadastro do usuário
    if (response.mensagem) {
      return response.mensagem;
    }
    if (response.errors) {
      return response.errors;
    }
    if (response.error) {
      return response.error + response.details;
    }
    if (!response) throw new Error("Erro inesperado no servidor");
    return response;
  } catch (error) {
    console.error("Erro inesperado no servidor:", error);
    throw error;
  }
};
