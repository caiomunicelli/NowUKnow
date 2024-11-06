import React, { useState } from "react";
import { useAuth } from "../../components"; // Importando o useAuth
import { useNavigate } from "react-router-dom"; // Importando o useNavigate para navegação dinâmica
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // Acessando a função de login via useAuth
  const navigate = useNavigate(); // Criando a função de navegação

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isLoggedIn = await login(email, senha); // Chamando a função de login
    if (isLoggedIn) {
      // Redireciona para a página principal após login bem-sucedido
      navigate("/"); // Navegação para a página principal
    } else {
      setError("Email ou senha incorretos.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
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
            className="form-control"
            id="senha"
            required
            value={senha}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Entrar
        </button>
      </form>
      <p className="mt-3">
        Não tem uma conta? <Link to="/signup">Cadastre-se aqui</Link>
      </p>
    </div>
  );
}

export default Login;