import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext"; // Importando o hook de autenticação

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext(); // Verificando se o usuário está autenticado

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para o login
    return <Navigate to="/login" />;
  }

  return children; // Se autenticado, renderiza o componente filho
};

export default PrivateRoute;
