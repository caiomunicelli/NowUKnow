import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redirecionamento após o cadastro
import { signup } from "../../services/usuarioService";
import ErrorMessage from "../ErrorMessage"; // Importando o componente de erro

function Signup() {
  const [nome, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  const navigate = useNavigate();

  const validateName = (name) => {
    if (name.trim() === "") {
      return "Nome é obrigatório.";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (email.trim() === "") {
      return "Email é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return "Por favor, insira um email válido.";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (password.trim() === "") {
      return "Senha é obrigatória.";
    } else if (password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Atualiza o estado dos campos com o valor atual
    if (id === "nome") setName(value);
    if (id === "email") setEmail(value);
    if (id === "senha") setPassword(value);

    // Valida o campo atualizado
    const newErrors = { ...errors };

    if (id === "nome") newErrors.nome = validateName(value);
    if (id === "email") newErrors.email = validateEmail(value);
    if (id === "senha") newErrors.senha = validatePassword(value);

    setErrors(newErrors); // Atualiza o estado de erros
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Valida o formulário inteiro antes de submeter
    const newErrors = {
      nome: validateName(nome),
      email: validateEmail(email),
      senha: validatePassword(senha),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) return; // Se algum campo estiver inválido, não envia o formulário

    try {
      const tipo = "basico";
      const novoUsuario = { nome, email, senha, tipo };
      console.log(novoUsuario);
      console.log(JSON.stringify(novoUsuario));
      const response = await signup(novoUsuario);
      if (response) {
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
            onChange={handleChange} // Validação no onChange
            required
          />
          <ErrorMessage message={errors.nome} />{" "}
          {/* Exibindo a mensagem de erro */}
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
            onChange={handleChange} // Validação no onChange
            required
          />
          <ErrorMessage message={errors.email} />{" "}
          {/* Exibindo a mensagem de erro */}
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
            onChange={handleChange} // Validação no onChange
            required
          />
          <ErrorMessage message={errors.senha} />{" "}
          {/* Exibindo a mensagem de erro */}
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
