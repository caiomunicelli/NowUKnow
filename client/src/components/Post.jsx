import React from "react";
import "./Post.css";

const Post = ({ title, username, date, text }) => {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");

  return (
    <div className="post">
      <h3 className="post-title">{title}</h3>
      <p className="post-user">Por: {username}</p>
      <p className="post-date">Publicado em: {formattedDate}</p>
      {text && <p className="post-text">{text}</p>}
    </div>
  );
};

export default Post;
