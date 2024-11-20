import {
  createConteudo,
  getConteudoByPost,
  updateConteudo,
} from "../api/conteudoApi.jsx";
import { getToken } from "./authService";

export const publicaConteudo = async (conteudo) => {
  try {
    console.log("Estamos no publicaConteudo", conteudo);
    conteudo.forEach((value, key) => {
      console.log(key, value);
    });
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

export const editaConteudo = async (conteudo_id, conteudo) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await updateConteudo(conteudo_id, conteudo, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao editar Conteudo no service");
    return response;
  } catch (error) {
    console.error("Erro ao editar Conteudo no service:", error);
    throw error;
  }
};