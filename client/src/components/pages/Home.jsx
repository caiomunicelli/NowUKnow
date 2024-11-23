import React from "react";
import { Feed } from "../../components";
import "./Home.css";

function Home() {
  const posts = [];
  return <Feed postagens={posts} />;
}

export default Home;
