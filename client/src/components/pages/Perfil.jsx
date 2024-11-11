import React, { useState, useEffect } from "react";
import { fetchUsuarioLogado } from "../../services/usuarioService";
import "./Perfil.css";

const PerfilPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState(null);

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
    </div>
  );
};

export default PerfilPage;
