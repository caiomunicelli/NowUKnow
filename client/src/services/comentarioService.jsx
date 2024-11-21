import {
  createComentario,
  updateComentario,
  deleteComentario,
} from "../api/comentarioApi.jsx";
import { getToken } from "./authService";

export const publicaComentario = async (comentario) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await createComentario(comentario, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao publicar Comentário no service");
    return response;
  } catch (error) {
    console.error("Erro ao publicar Comentário no service:", error);
    throw error;
  }
};

// export const pegaComentarios = async (postagem_id) => {
//   try {
//     const token = getToken(); // Obtém o token do authService
//     if (!token) throw new Error("Usuário não autenticado");
//     const response = await getComentariosByPost(postagem_id, token); // Chama a API de cadastro do usuário
//     if (!response) throw new Error("Erro ao obter Comentários no service");
//     return response;
//   } catch (error) {
//     console.error("Erro ao obter Comentários no service:", error);
//     throw error;
//   }
// };

export const editaComentario = async (comentario, comentario_id) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await updateComentario(comentario, comentario_id, token); // Chama a API de cadastro do usuário
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

export const deletaComentario = async (comentario_id) => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await deleteComentario(comentario_id, token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao deletar comentário no service");
    return response;
  } catch (error) {
    console.error("Erro ao deletar comentário no service:", error);
    throw error;
  }
};
