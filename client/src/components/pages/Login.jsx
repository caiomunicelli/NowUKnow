import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext"; // Atualizando a importação do useAuth
import { useNavigate } from "react-router-dom"; // Importando o useNavigate para navegação dinâmica
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Criando a função de navegação

  const { login, error: authError } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Envia as credenciais como um objeto
    const credentials = { email, senha };
    const isLoggedIn = await login(credentials); // Chamando a função de login
    if (isLoggedIn) {
      // Redireciona para a página principal após login bem-sucedido
      navigate("/"); // Navegação para a página principal
    } else {
      setError("Email ou senha incorretos.");
    }
  };

  return (
    <div className="nowuknow-box-container">
      <h2>Login</h2>
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
      </form>
      <p className="mt-3">
        Não tem uma conta? <Link to="/signup">Cadastre-se aqui</Link>
      </p>
    </div>
  );
}

export default Login;
