// src/components/Login.jsx
import React from "react";
import { Link } from "react-router-dom"; // Importando Link para redirecionar

function Login() {
  return (
    <div className="container">
      <h2>Login</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input type="email" className="form-control" id="email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Senha
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Entrar
        </button>
      </form>
      <p className="mt-3">
        Não tem uma conta? <Link to="/signup">Cadastre-se aqui</Link>{" "}
        {/* Link para a página de cadastro */}
      </p>
    </div>
  );
}

export default Login;
