// client/src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { loginUsuario } from "../api/usuarioApi";
import { saveToken, clearToken, getToken } from "../services/authService";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginUsuario(credentials);
      saveToken(data.token);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout, error };
};
