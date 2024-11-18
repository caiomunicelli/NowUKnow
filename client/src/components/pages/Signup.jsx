import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../ErrorMessage";
import { gerenciarErros } from "../../utils/validacoesUsuario";
import { signup } from "../../services/usuarioService";

function Signup({ onLoginClick }) {
  const [nome, setName] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [confirmSenha, setConfirmSenha] = useState(""); // Novo campo de confirmação de senha
  const [foto, setFoto] = useState(null);
  const [campoAlterado, setCampoAlterado] = useState("");
  const [errors, setErrors] = useState({
    nome: "",
    usuario: "",
    email: "",
    senha: "",
    confirmSenha: "", // Adiciona erro de confirmação de senha
    foto: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (campoAlterado) {
      console.log(campoAlterado);
      const newErrors = gerenciarErros(
        nome,
        usuario,
        email,
        senha,
        confirmSenha,
        foto,
        campoAlterado, // Passando o campo alterado para validação
        errors
      );
      setErrors(newErrors);
    }
  }, [campoAlterado, nome, usuario, email, senha, confirmSenha, foto]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Atualiza o valor do campo
    if (id === "nome") setName(value);
    if (id === "usuario") setUsuario(value);
    if (id === "email") setEmail(value);
    if (id === "senha") setPassword(value);
    if (id === "confirmSenha") setConfirmSenha(value);

    setCampoAlterado(id);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    setCampoAlterado("foto");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCampoAlterado("cadastro");
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    const novoUsuario = new FormData();
    novoUsuario.append("nome", nome);
    novoUsuario.append("usuario", usuario);
    novoUsuario.append("email", email);
    novoUsuario.append("senha", senha);
    novoUsuario.append("tipo", "tipo_usuario");
    if (foto) {
      novoUsuario.append("foto", foto);
    }
    const response = await signup(novoUsuario);

    if (response) {
      navigate("/");
    } else {
      console.error("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="nowuknow-box-container">
      <h2>Cadastrar</h2>
      <form onSubmit={handleSubmit} className="nowuknow-form-container">
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome
          </label>
          <input
            type="text"
            className="nowuknow-input"
            id="nome"
            value={nome}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <ErrorMessage message={errors.nome} />
        </div>
        <div className="mb-3">
          <label htmlFor="usuario" className="form-label">
            Nome de Usuário
          </label>
          <input
            type="text"
            className="nowuknow-input"
            id="usuario"
            value={usuario}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <ErrorMessage message={errors.usuario} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="nowuknow-input"
            id="email"
            value={email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <ErrorMessage message={errors.email} />
        </div>
        <div className="mb-3">
          <label htmlFor="senha" className="form-label">
            Senha
          </label>
          <input
            type="password"
            className="nowuknow-input"
            id="senha"
            value={senha}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <ErrorMessage message={errors.senha} />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmSenha" className="form-label">
            Confirmar Senha
          </label>
          <input
            type="password"
            className="nowuknow-input"
            id="confirmSenha"
            value={confirmSenha}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <ErrorMessage message={errors.confirmSenha} />
        </div>
        <div className="mb-3">
          <label htmlFor="foto" className="form-label">
            Foto de Perfil
          </label>
          <input
            type="file"
            className="nowuknow-input"
            id="foto"
            onChange={handleFotoChange}
            accept="image/png, image/jpeg, image/jpg"
          />
          <ErrorMessage message={errors.foto} />
        </div>
        <button type="submit" className="nowuknow-btn">
          Cadastrar
        </button>
      </form>
      <p className="mt-3">
        Já tem uma conta?{" "}
        <button
          type="button"
          className="nowuknow-login-link"
          onClick={onLoginClick}
        >
          Faça login aqui
        </button>
      </p>
    </div>
  );
}

export default Signup;
