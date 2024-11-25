import React from "react";
import { Feed } from "../../components";
import "./Home.css";

function Home() {
  const posts = [];
  return (
    <div className="nowuknow-home-container">
      <div className="nowuknow-home-heading">
        <h2>Venha aprender com</h2>
        <h1>NowUKnow</h1>
        <h3>Sua plataforma de aprendizado gratuita</h3>
      </div>
      <Feed postagens={posts} />
    </div>
  );
}

export default Home;
