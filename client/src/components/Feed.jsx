import React, { useState, useEffect } from "react";
import NewPostForm from "./pages/CreatePost";
import Post from "./Post"; // Componente de visualização do post
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para buscar posts
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

  // Fetch inicial (carregado apenas uma vez)
  useEffect(() => {
    fetchPosts();
  }, []);

  // Função para adicionar um novo post
  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]); // Adiciona o novo post no início da lista
  };

  return (
    <div className="feed-container">
      {/* Formulário de criação de post */}
      <div className="post-form-container">
        <NewPostForm onSubmitPost={handleNewPost} />
      </div>

      {/* Lista de posts */}
      <div className="post-feed">
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
