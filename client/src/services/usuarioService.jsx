// client/src/services/userService.js
import { signupUsuario, getUsuarioAtual } from "../api/usuarioApi";
import { getToken } from "./authService";

export const fetchUsuarioLogado = async () => {
  // Função para obter dados do usuário atual
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");

    const userData = await getUsuarioAtual(token); // Chama o getUsuarioAtual da API
    if (!userData) throw new Error("Erro ao obter dados do usuário");

    return userData; // Retorna os dados do usuário
  } catch (error) {
    console.error("Erro ao buscar usuário atual:", error);
    throw error; // Lança o erro para o chamador tratar
  }
};

export const signup = async (usuario) => {
  try {
    const response = await signupUsuario(usuario); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao cadastrar usuário");
    return response;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    throw error;
  }
};
