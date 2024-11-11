import React from "react";
import "./Post.css";

const Post = ({ title, username, date, text }) => {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");

  return (
    <div className="nowuknow-post-container">
      <h3 className="nowuknow-post-title">{title}</h3>
      <p className="nowuknow-post-user">Por: {username}</p>
      <p className="nowuknow-post-date">Publicado em: {formattedDate}</p>
      {text && <p className="nowuknow-post-text">{text}</p>}
    </div>
  );
};

export default Post;
