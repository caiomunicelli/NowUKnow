// client/src/services/postagemService.js
import {
  createDiscussao,
  getDiscussaoByPostId,
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
    const response = await getDiscussaoByPostId(postagem_id, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao obter Discussão no service");
    return response;
  } catch (error) {
    console.error("Erro ao obter Discussão no service:", error);
    throw error;
  }
};

export const editaDiscussao = async (discussao_id, discussao) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await updateDiscussao(discussao_id, discussao, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao editar Discussão no service");
    return response;
  } catch (error) {
    console.error("Erro ao editar Discussão no service:", error);
    throw error;
  }
};
