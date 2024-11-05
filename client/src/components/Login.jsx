// src/components/Login.jsx
import React from "react";
import { Link } from "react-router-dom"; // Importando Link para redirecionar

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      senha: senha,
    };

    try {
      const response = await fetch("/api/v1/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("Login efeituado com sucesso!");
        navigate("/");
      } else {
        console.error("Email ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
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
          <input type="email" className="form-control" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label htmlFor="senha" className="form-label">
            Senha
          </label>
          <input
            type="password"
            className="form-control"
            id="senha"
            value={senha}
            onChange={(e) => setPassword(e.target.value)}
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
