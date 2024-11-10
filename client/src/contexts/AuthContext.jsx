// src/contexts/AuthContext.jsx
import React, { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth"; // Usando o hook useAuth

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth(); // Hook que já contém toda a lógica de autenticação

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook customizado para consumir o contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
