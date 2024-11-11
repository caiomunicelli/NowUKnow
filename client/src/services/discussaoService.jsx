// client/src/services/postagemService.js
import { createDiscussao } from "../api/discussaoApi.jsx";
import { getToken } from "./authService";

export const publicaDiscussao = async (discussao) => {
    try {
      const token = getToken(); // Obtém o token do authService
      if (!token) throw new Error("Usuário não autenticado");
      const response = await createDiscussao(discussao,token); // Chama a API de cadastro do usuário
      if (!response) throw new Error("Erro ao publicar Discussão no service");
      return response;
    } catch (error) {
      console.error("Erro ao publicar Discussão no service:", error);
      throw error;
    }
};