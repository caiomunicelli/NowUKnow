import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { Comentario, NovoComentario } from "../components/";
import "./Postagem.css";
import { getToken } from "../services/authService";
import Post from "./Post";

const Postagem = () => {
  const { id } = useParams();
  const [comentarios, setComentarios] = useState([]);
  const [postagem, setPostagem] = useState(null);
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [loadingPostagem, setLoadingPostagem] = useState(false);
  const { isAuthenticated } = useAuthContext();

  const fetchComentariosByPostagem = async () => {
    setLoadingComentarios(true);
    try {
      const response = await fetch(`/api/v1/comentarios/allComments/${id}`);
      const postagemComentarios = await response.json();
      setComentarios(postagemComentarios);
    } catch (error) {
      console.error("Erro ao carregar comentários da postagem:", error);
    } finally {
      setLoadingComentarios(false);
    }
  };

  const fetchPostagemDetails = async () => {
    setLoadingPostagem(true);
    try {
      const response = await fetch(`/api/v1/postagens/postagem/${id}`);
      const postagemData = await response.json();
      setPostagem(postagemData);
    } catch (error) {
      console.error("Erro ao carregar detalhes da postagem:", error);
    } finally {
      setLoadingPostagem(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostagemDetails();
      fetchComentariosByPostagem();
    }
  }, [id]);

  return (
    <div className="nowuknow-comentarios-postagem">
      {loadingPostagem ? (
        <p>Carregando detalhes da postagem...</p>
      ) : postagem ? (
        <Post
          key={postagem.postagem_id}
          postagemId={postagem.postagem_id}
          post={postagem}
          comentarioCount={comentarios.length || 0}
          full={true} // Passa o número de comentários
        />
      ) : (
        <p>Postagem não encontrada.</p>
      )}

      <h3 className="nowuknow-title-comentario">Comentários</h3>

      {isAuthenticated && (
        <NovoComentario
          postagemId={id}
          onComentarioCriado={fetchComentariosByPostagem}
        />
      )}

      {loadingComentarios ? (
        <p>Carregando comentários...</p>
      ) : comentarios.length > 0 ? (
        comentarios.map((comentario) => (
          <Comentario
            key={comentario.comentario_id}
            comentario={comentario}
            fetchComentariosByPostagem={fetchComentariosByPostagem}
          />
        ))
      ) : (
        <p className="no-comentarios">
          Que tal ser o primeiro a deixar seu comentário?
        </p>
      )}
    </div>
  );
};

export default Postagem;
