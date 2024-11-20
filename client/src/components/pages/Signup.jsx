import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ErrorMessage from "../ErrorMessage";
import { gerenciarErros } from "../../utils/validacoesUsuario";
import { signup, editar } from "../../services/usuarioService";

function Signup({ onLoginClick }) {
  const location = useLocation();
  const usuario = location.state?.usuario || null;

  const [nome, setName] = useState("");
  const [usuarioNome, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [foto, setFoto] = useState(null);
  const [campoAlterado, setCampoAlterado] = useState("");
  const [errors, setErrors] = useState({
    nome: "",
    usuario: "",
    email: "",
    senha: "",
    confirmSenha: "",
    foto: "",
  });

  const [previewFoto, setPreviewFoto] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para controlar o modal
  const navigate = useNavigate();

  // Preencher campos no modo edição
  useEffect(() => {
    if (usuario) {
      setName(usuario.nome || "");
      setUsuario(usuario.usuario || "");
      setEmail(usuario.email || "");
      setPreviewFoto(usuario.imagem || null);
      setTipo(usuario.tipo || "Basico");
    }
  }, [usuario]);

  useEffect(() => {
    if (campoAlterado) {
      const newErrors = gerenciarErros(
        nome,
        usuarioNome,
        email,
        senha,
        confirmSenha,
        foto,
        campoAlterado,
        errors
      );
      setErrors(newErrors);
    }
  }, [campoAlterado, nome, usuarioNome, email, senha, confirmSenha, foto]);

  const handleChange = (e) => {
    const { id, value } = e.target;
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
    setPreviewFoto(URL.createObjectURL(file));
    setCampoAlterado("foto");
  };

  const handleClearFoto = () => {
    setFoto(null);
    setPreviewFoto(null);
    setCampoAlterado("foto");
  };

  const handleSubmit = async () => {
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("usuario", usuarioNome);
    formData.append("email", email);
    formData.append("senha", senha);

    if (foto) {
      formData.append("foto", foto);
    }

    if (usuario) {
      formData.append("tipo,", tipo);
      const response = await editar(formData);
      if (response) {
        navigate("/perfil");
      } else {
        console.error("Erro ao atualizar usuário.");
      }
    } else {
      const response = await signup(formData);
      if (response) {
        navigate("/");
      } else {
        console.error("Erro ao cadastrar usuário.");
      }
    }
  };

  const openConfirmationModal = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="nowuknow-box-container">
      <h2>{usuario ? "Editar Usuário" : "Cadastrar"}</h2>
      <form
        onSubmit={openConfirmationModal}
        className="nowuknow-form-container"
      >
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
            value={usuarioNome}
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
            disabled={!!usuario}
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
          {previewFoto && (
            <div className="nowuknow-foto-preview">
              <img src={previewFoto} alt="Preview" />
            </div>
          )}
          <input
            type="file"
            className="nowuknow-input"
            id="foto"
            onChange={handleFotoChange}
            accept="image/png, image/jpeg, image/jpg"
          />
          {previewFoto && (
            <button
              type="button"
              className="nowuknow-btn-clear"
              onClick={handleClearFoto}
            >
              Limpar Foto
            </button>
          )}
          <ErrorMessage message={errors.foto} />
        </div>
        <button type="submit" className="nowuknow-btn">
          {usuario ? "Salvar Alterações" : "Cadastrar"}
        </button>
      </form>
      {showConfirmation && (
        <div className="nowuknow-modal">
          <div className="nowuknow-modal-content">
            <p>
              Tem certeza que deseja{" "}
              {usuario ? "salvar as alterações" : "cadastrar"}?
            </p>
            <button onClick={handleSubmit} className="nowuknow-btn-confirm">
              Confirmar
            </button>
            <button
              onClick={closeConfirmationModal}
              className="nowuknow-btn-cancel"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      {!usuario && (
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
      )}
    </div>
  );
}

export default Signup;
