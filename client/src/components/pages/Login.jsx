import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, senha };
    const isLoggedIn = await login(credentials);
    if (isLoggedIn) {
      navigate("/");
      onClose();
    } else {
      setError("Email ou senha incorretos.");
    }
  };

  const handleGoToSignUp = () => {
    onClose(); // Fecha o menu de login
    navigate("/signup"); // Navega para a página de cadastro
  };

  return (
    <div className="nowuknow-login-float">
      <form onSubmit={handleSubmit} className="nowuknow-form-container">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="nowuknow-input"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="senha" className="form-label">
            Senha
          </label>
          <input
            type="password"
            className="nowuknow-input"
            id="senha"
            required
            value={senha}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="nowuknow-btn">
          Entrar
        </button>
        <p className="cadastro-link mt-3">
          Não tem uma conta?{" "}
          <span className="link" onClick={handleGoToSignUp}>
            Cadastre-se aqui
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
