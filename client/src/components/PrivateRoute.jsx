// src/components/PrivateRoute.jsx
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Importando o hook de autenticação

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth(); // Verificando se o usuário está autenticado

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/login" />} // Se não estiver autenticado, redireciona para o login
    />
  );
};

export default PrivateRoute;
