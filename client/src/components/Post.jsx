import React from 'react';
import './Post.css';

const Post = ({ title, description, tipoConteudo, nivelDificuldade, categoria, imageUrl, user }) => {
  return (
    <div className="post">
      <header className="post-header">
        <img className="post-user-avatar" src={user.avatar} alt="User avatar" />
        <span className="post-username">{user.name}</span>
      </header>
      
      <img className="post-image" src={imageUrl} alt="Post content" />

      <div className="post-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <p><strong>Tipo:</strong> {tipoConteudo}</p>
        <p><strong>Dificuldade:</strong> {nivelDificuldade}</p>
        <p><strong>Categoria:</strong> {categoria}</p>
      </div>
    </div>
  );
};

export default Post;
