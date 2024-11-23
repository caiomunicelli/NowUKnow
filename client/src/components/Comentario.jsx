import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUsuarioLogado } from "../services/usuarioService";
import { useAuthContext } from "../contexts/AuthContext";
import {
  pegaComentarios,
  editaComentario,
  publicaComentario,
  deletaComentario,
} from "../services/comentarioService";
import { Avatar } from "./";
import "./Comentario.css";

const Comentario = ({ comentario, fetchComentariosByPostagem }) => {
  const { isAuthenticated } = useAuthContext();
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const [editarComentario, setEditarComentario] = useState(false);
  const [textoEditado, setTextoEditado] = useState(comentario.comentario_texto);

  useEffect(() => {
    const loadUsuario = async () => {
      try {
        const dadosUsuario = await fetchUsuarioLogado();
        console.log("dadosUsuario:", dadosUsuario);
        setUsuario(dadosUsuario);
      } catch (error) {
        setErro("Erro ao carregar os dados do usuário.");
        console.error(error);
      }
    };
    if (isAuthenticated) {
      loadUsuario();
    }
  }, []);

  const handleEditarComentario = () => {
    setEditarComentario(true);
  };

  const handleTextoEditado = (evento) => {
    setTextoEditado(evento.target.value);
  };

  const handleSalvarEdicao = async () => {
    const comentarioEditado = { texto: textoEditado };
    const response = await editaComentario(comentarioEditado, comentario.id);
    if (response) {
      setEditarComentario(false);
      fetchComentariosByPostagem();
    } else {
      console.error("Erro ao editar comentário");
    }
  };

  const handleApagarComentario = async () => {
    const response = await deletaComentario(comentario.id);
    if (response) {
      console.log("Comentário apagado");
      fetchComentariosByPostagem();
    } else {
      console.error("Erro ao apagar comentário");
    }
  };

  return (
    <div className="nowuknow-comentario-container">
      <div className="nowuknow-comentario">
        <Link to={`/perfil/${comentario.usuario_nome}`}>
          <h5 className="nowuknow-post-title">{comentario.usuario_nome}</h5>
        </Link>
        <Avatar
          imagem={comentario.usuario_imagem}
          nome={comentario.usuario_nome_completo}
          tamanho={40}
        />
        {editarComentario ? (
          <textarea
            value={textoEditado}
            onChange={handleTextoEditado}
            className="form-control"
          />
        ) : (
          <p className="nowuknow-post-text">{comentario.comentario_texto}</p>
        )}
        <p className="nowuknow-post-date">
          Criado em:{" "}
          {new Date(comentario.comentario_data).toLocaleDateString("pt-BR")}
        </p>
        {usuario && usuario.id === comentario.usuario_id && (
          <div>
            {editarComentario ? (
              <button onClick={handleSalvarEdicao}>Salvar mudanças</button>
            ) : (
              <button onClick={handleEditarComentario}>Editar</button>
            )}
            <button onClick={handleApagarComentario}>Apagar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comentario;
