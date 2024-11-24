import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUsuario } from "../api/usuarioApi";
import { saveToken, clearToken, getToken } from "../services/authService";
import { fetchUsuarioLogado } from "../services/usuarioService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(null); // Novo estado de carregamento

  useEffect(() => {
    // Verifica o token armazenado ao carregar o componente
    const token = getToken();
    setIsAuthenticated(!!token);
    setIsLoading(false); // Depois de verificar o token, define isLoading como false
  }, []);

  useEffect(() => {
    atualizaUsuarioLogado();
  }, [isAuthenticated]);

  useEffect(() => {}, [usuarioLogado]);

  const atualizaUsuarioLogado = async () => {
    if (isAuthenticated) {
      console.log("Estou chamando o fetchUsuarioLogado");
      let usuarioData = await fetchUsuarioLogado();
      delete usuarioData.senha;
      setUsuarioLogado(usuarioData);
    } else {
      setUsuarioLogado(null);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await loginUsuario(credentials);
      saveToken(data.token); // Salva o token no cookie
      setIsAuthenticated(true); // Atualiza o estado para refletir que o usuário está autenticado
      console.log("login feito");
      setError(null); // Limpa qualquer erro de autenticação
      return true;
    } catch (error) {
      setError(error.message); // Define o erro, caso a autenticação falhe
      return false;
    }
  };

  const logout = () => {
    clearToken(); // Limpa o token do cookie
    setIsAuthenticated(false); // Atualiza o estado para refletir que o usuário saiu
  };

  if (isLoading) {
    return <div></div>; // Exibe uma tela de loading enquanto verifica a autenticação
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        error,
        usuarioLogado,
        setUsuarioLogado,
        atualizaUsuarioLogado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para acessar o contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
