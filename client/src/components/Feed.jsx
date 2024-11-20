import React, { useState, useEffect } from "react";
import Post from "./Post";
import "./Feed.css";

const Feed = ({postagens}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

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
              post={post}
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
