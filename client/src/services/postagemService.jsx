// client/src/services/postagemService.js
import {
  createPostagem,
  deletePostagem,
  updatePostagem,
} from "../api/postagemApi.jsx";
import { getToken } from "./authService";

export const publicaPostagem = async (postagem) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    // console.log(postagem);
    const response = await createPostagem(postagem, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao publicar postagem no service");
    return response;
  } catch (error) {
    console.error("Erro ao publicar postagem no service:", error);
    throw error;
  }
};

export const deletaPostagem = async (postagem_id) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await deletePostagem(postagem_id, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao deletar postagem no service");
    return response;
  } catch (error) {
    console.error("Erro ao deletar postagem no service:", error);
    throw error;
  }
};

export const editaPostagem = async (postagem, postagem_id) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await updatePostagem(postagem, postagem_id, token);
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
