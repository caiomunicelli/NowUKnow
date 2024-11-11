import React from "react";
import { Feed } from "../../components";
import "./Home.css";

function Home() {
  return (
    <div className="nowuknow-home-container">
      <h1>Postagens Recentes</h1>
      <Feed />
    </div>
  );
}

export default Home;
