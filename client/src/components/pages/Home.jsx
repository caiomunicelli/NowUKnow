import React from "react";
import { Feed } from "../../components";
import "./Home.css";

function Home() {
  const posts = [];
  return (
    <div className="nowuknow-home-container">
      <Feed postagens={posts}/>
    </div>
  );
}

export default Home;
