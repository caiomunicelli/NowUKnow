import {
  createConteudo,
  getConteudoByPost,
  updateConteudo,
} from "../api/conteudoApi.jsx";
import { getToken } from "./authService";

export const publicaConteudo = async (conteudo) => {
  try {
    // console.log("Estamos no publicaConteudo", conteudo);
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await createConteudo(conteudo, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao publicar Conteudo no service");
    return response;
  } catch (error) {
    console.error("Erro ao publicar Conteudo no service:", error);
    throw error;
  }
};

export const pegaConteudo = async (postagem_id) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await getConteudoByPost(postagem_id, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao obter Conteudo no service");
    return response;
  } catch (error) {
    console.error("Erro ao obter Conteudo no service:", error);
    throw error;
  }
};

export const editaConteudo = async (conteudo, conteudo_id) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await updateConteudo(conteudo, conteudo_id, token);
    // console.log("Resposta:", response);
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
