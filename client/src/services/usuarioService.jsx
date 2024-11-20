// client/src/services/userService.js
import {
  signupUsuario,
  getUsuarioAtual,
  deleteUsuarioAtual,
  updateUsuario,
  removerFotoUsuario,
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
    if (!response) throw new Error("Erro ao deletar usuário. (usuarioService)");
    return response;
  } catch (error) {
    console.error("Erro ao deletar usuário (usuarioService):", error);
    throw error;
  }
};

export const editar = async (usuario) => {
  try {
    console.log("Editar:");
    for (let [key, value] of usuario.entries()) {
      console.log(`${key}:`, value);
    }
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");
    const response = await updateUsuario(token, usuario); // Chama a API de cadastro do usuário
    if (!response) throw new Error("Erro ao editar usuário no service");
    return response;
  } catch (error) {
    console.error("Erro ao editar usuário no service:", error);
    throw error;
  }
};

export const removerFotoPerfil = async () => {
  try {
    const token = getToken(); // Obtém o token do authService
    if (!token) throw new Error("Usuário não autenticado");

    const response = await removerFotoUsuario(token); // Chama a API para remover a foto
    if (!response)
      throw new Error("Erro ao remover foto do usuário (userService)");

    return response; // Retorna a resposta
  } catch (error) {
    console.error("Erro ao remover foto no service:", error);
    throw error;
  }
};
