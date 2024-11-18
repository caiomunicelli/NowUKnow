// client/src/services/userService.js
import {
  signupUsuario,
  getUsuarioAtual,
  deleteUsuarioAtual,
} from "../api/usuarioApi";
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
    console.log(usuario);
    const response = await signupUsuario(usuario); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao cadastrar usuário no service");
    return response;
  } catch (error) {
    console.error("Erro ao cadastrar usuário no service:", error);
    throw error;
  }
};

export const deletar = async () => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await deleteUsuarioAtual(token); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao deletar usuário");
    return response;
  } catch (error) {
    console.error("Erro ao cadastrar usuário no service:", error);
    throw error;
  }
};
