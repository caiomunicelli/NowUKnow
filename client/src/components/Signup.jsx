// src/components/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redirecionamento após o cadastro

function Signup() {
  const [nome, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      nome: nome,
      email: email,
      senha: senha,
      tipo: "estudante"
    };

    try {
      const response = await fetch("/api/v1/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("Usuário cadastrado com sucesso!");
        navigate("/login");
      } else {
        console.error("Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <div className="container">
      <h2>Cadastrar</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome
          </label>
          <input
            type="text"
            className="form-control"
            id="nome"
            value={nome}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            value={senha}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Cadastrar
        </button>
      </form>
      <p className="mt-3">
        Já tem uma conta? <a href="/login">Faça login aqui</a>
      </p>
    </div>
  );
}

export default Signup;
