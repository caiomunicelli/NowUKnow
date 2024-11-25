import React, { useState, useEffect } from "react";
import Post from "./Post";
import "./Feed.css";

const Feed = ({postagens}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comentarioCount, setComentarioCount] = useState({});

  const fetchComentarios = async () => {
    try {
      const response = await fetch(`/api/v1/comentarios/`); // Rota para listar os comentários
      const comentariosData = await response.json();

      // Conta os comentários por postagem
      const countMap = comentariosData.reduce((acc, comentario) => {
        acc[comentario.postagemId] = (acc[comentario.postagemId] || 0) + 1;
        return acc;
      }, {});
      
      setComentarioCount(countMap);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      console.log(JSON.stringify(postagens) + " posts - ")
      if(postagens.length == 0){
        const response = await fetch(`/api/v1/postagens/allDetails`);
        const newPosts = await response.json();
        setPosts(newPosts);
      }
      else{
        setPosts(postagens);
      }
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComentarios();
    fetchPosts();
  }, []);

  return (
    <div className="nowuknow-feed-container">
      <div className="nowuknow-post-feed">
        {loading ? (
          <p>Carregando posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <Post
              key={post.postagem_id || index}
              postagemId={post.postagem_id}
              post={post}
              comentarioCount={comentarioCount[post.postagem_id] || 0} // Passa o número de comentários
            />
          ))
        ) : (
          <p className="no-posts">Sem informações.</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
