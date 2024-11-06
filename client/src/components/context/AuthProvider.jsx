import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Criação do AuthContext
const AuthContext = createContext();

// Custom Hook para acessar o AuthContext
export const useAuth = () => useContext(AuthContext);

// O Provider que irá envolver os componentes e passar o contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // UseEffect para verificar se há token salvo e carregar dados do usuário
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("/api/v1/usuarios", {
        method: "GET",
        headers: { "x-access-token": token },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Ajustar de acordo com a resposta da API
        setUser(data.nome);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  // Função de login
  const login = async (email, senha) => {
    try {
      const response = await fetch("/api/v1/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Sucesso: ", data);
        Cookies.set("authToken", data.token, { expires: 30 });
        fetchUserData(data.token); // Atualiza os dados do usuário
        return true; // Login bem-sucedido
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return false; // Falha no login
    }
  };

  // Função de logout
  const logout = () => {
    Cookies.remove("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
