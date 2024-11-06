import React, { useState } from 'react';
import NewPostForm from './CreatePost';
import Post from './Post'; // Componente de visualização do post
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);

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
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Post key={index} {...post} user={{ name: "User", avatar: "user-avatar-url.jpg" }} />
          ))
        ) : (
          <p className="no-posts">Sem informações.</p>
        )}
      </div>
    </div>
  );
};

export default Feed;