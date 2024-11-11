// client/src/services/postagemService.js
import { createPostagem } from "../api/postagemApi.jsx";
import { getToken } from "./authService";

export const publicaPostagem = async (postagem) => {
    try {
      const token = getToken(); // Obtém o token do authService
      if (!token) throw new Error("Usuário não autenticado");
      console.log(postagem);
      const response = await createPostagem(postagem); // Chama a API de cadastro do usuário
      if (!response) throw new Error("Erro ao publicar postagem no service");
      return response;
    } catch (error) {
      console.error("Erro ao publicar postagem no service:", error);
      throw error;
    }
};