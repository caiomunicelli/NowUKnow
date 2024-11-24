import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUsuarioLogado } from "../services/usuarioService";
import { useAuthContext } from "../contexts/AuthContext";
import {
  editaComentario,
  deletaComentario,
} from "../services/comentarioService";
import { Avatar } from "./";
import "./Comentario.css";

const Comentario = ({ comentario, fetchComentariosByPostagem }) => {
  const { isAuthenticated, usuarioLogado } = useAuthContext();
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const [editarComentario, setEditarComentario] = useState(false);
  const [textoEditado, setTextoEditado] = useState(comentario.comentario_texto);

  const handleEditarComentario = () => {
    setEditarComentario(true);
  };

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long", // Exibe o mês por extenso
    year: "numeric",
  }).format(new Date(comentario.comentario_data));

  const handleTextoEditado = (evento) => {
    setTextoEditado(evento.target.value);
  };

  useEffect(() => {
    setUsuario(usuarioLogado);
  }, [usuarioLogado]);

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
        <div className="nowuknow-comentario-texto">
          {editarComentario ? (
            <textarea
              value={textoEditado}
              onChange={handleTextoEditado}
              className="form-control"
            />
          ) : (
            <p className="nowuknow-post-text">{comentario.comentario_texto}</p>
          )}
          <div className="nowuknow-comentario-bottom">
            <div className="nowuknow-post-author">
              <Avatar
                imagem={comentario.usuario_imagem}
                nome={comentario.usuario_nome_completo}
                tamanho={40}
              />
              <div className="nowuknow-post-author-info">
                <Link to={`/perfil/${comentario.usuario_nome}`}>
                  <p className="nowuknow-post-user">
                    {comentario.usuario_nome}
                  </p>
                </Link>
                <p className="nowuknow-post-date">{formattedDate}</p>
              </div>
            </div>

            {usuario &&
              (usuario.id === comentario.usuario_id ||
                usuario.tipo === "Moderador") && (
                <div className="nowuknow-comentario-actions">
                  {editarComentario ? (
                    <>
                      <i
                        className="bi bi-check nowuknow-small-icon nowuknow-green-icon"
                        title="Salvar mudanças"
                        onClick={handleSalvarEdicao}
                      ></i>
                      <i
                        className="bi bi-x nowuknow-small-icon nowuknow-red-icon"
                        title="Cancelar edição"
                        onClick={() => setEditarComentario(false)}
                      ></i>
                    </>
                  ) : (
                    <>
                      <i
                        className="bi bi-pencil nowuknow-small-icon"
                        title="Editar comentário"
                        onClick={handleEditarComentario}
                      ></i>
                      <i
                        className="bi bi-trash nowuknow-small-icon nowuknow-red-icon"
                        title="Apagar comentário"
                        onClick={handleApagarComentario}
                      ></i>
                    </>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comentario;
