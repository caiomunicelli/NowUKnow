import React, { useState, useEffect } from "react";
import Post from "./Post";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/postagens/allDetails`);
      const newPosts = await response.json();
      setPosts(newPosts);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
              title={post.postagem_titulo}
              username={post.usuario_nome}
              date={post.postagem_data_publicacao}
              text={post.discussao_texto}
              postType={post.postagem_tipo}
              contentType={post.conteudo_tipo}
              contentUrl={post.conteudo_url}
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
