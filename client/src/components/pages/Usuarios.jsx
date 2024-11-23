import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Usuarios.css";

const UsuariosPage = ({ usuariosFiltrados = [] }) => {
  const [usuarios, setUsuarios] = useState(usuariosFiltrados);
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      if (usuariosFiltrados.length === 0) {
        const response = await fetch("/api/v1/usuarios/all");
        const usuariosData = await response.json();
        setUsuarios(usuariosData);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const navigate = useNavigate();

  const handleViewProfile = (usuarioId) => {
    navigate(`/perfil/${usuarioId}`);
  };

  return (
    <div className="nowuknow-box-container">
      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <div className="nowuknow-usuarios-lista">
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
                // eslint-disable-next-line react/jsx-key
                <div className="perfil-container">
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
                  <button
                    className="nowuknow-btn nowuknow-usuario-btn"
                    onClick={() => handleViewProfile(usuario.usuario)}
                  >
                    Ver perfil
                  </button>
                </div>
            ))
          ) : (
            <p className="no-usuarios">Nenhum usuário encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
