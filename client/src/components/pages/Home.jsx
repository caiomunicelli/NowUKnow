import React from "react";
import { Feed } from "../../components";
function Home() {
  return (
    <div>
      <h1>Bem vindo à NowUKnow</h1>
      <div className="nowuknow-feed-container">
        <Feed />
      </div>
    </div>
  );
}

export default Home;
