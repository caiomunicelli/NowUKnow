import React, { useState, useEffect } from "react";
import { fetchUsuarioLogado, deletar } from "../../services/usuarioService";
import "./Perfil.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  useEffect(() => {
    const loadUsuario = async () => {
      try {
        const dadosUsuario = await fetchUsuarioLogado(); // Chama o serviço para pegar dados do usuário
        setUsuario(dadosUsuario);
      } catch (error) {
        setErro("Erro ao carregar os dados do usuário.");
        console.error(error);
      }
    };

    loadUsuario();
  }, []);

  if (erro) {
    return <div>{erro}</div>; // Exibe mensagem de erro, se houver
  }

  if (!usuario) {
    return <div>Carregando...</div>; // Exibe "Carregando..." enquanto os dados não são carregados
  }

  const handleDeletarUsuario = async () => {
    try {
      const resposta = await deletar(); // Chama o serviço de deletar
      if (resposta) {
        console.log("Resposta:", resposta);
        // Caso o usuário seja deletado, você pode redirecionar ou exibir uma mensagem
        alert("Usuário deletado com sucesso!");
        logout();
        navigate("/");
      } else {
        alert("Erro ao deletar usuário. (handleDeletarUsuario)");
      }
    } catch (error) {
      setErro("Erro ao deletar o usuário. (handleDeletarUsuario)");
      console.error(error);
    }
  };

  return (
    <div className="perfil-container">
      <h1>Meu Perfil</h1>
      <div className="perfil-info">
        <img
          src={usuario.imagem}
          alt={usuario.nome}
          className="perfil-imagem"
        />
        <div className="perfil-dados">
          <p>
            <strong>Nome:</strong> {usuario.nome}
          </p>
          <p>
            <strong>Usuário:</strong> {usuario.usuario}
          </p>
          <p>
            <strong>Email:</strong> {usuario.email}
          </p>
          <p>
            <strong>Data de Criação:</strong>{" "}
            {new Date(usuario.data_criacao).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button onClick={handleDeletarUsuario} className="deletar-btn">
        Deletar Conta
      </button>
    </div>
  );
};

export default Perfil;
