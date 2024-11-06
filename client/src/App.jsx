import React from "react";
import "./App.css";
import {
  Navbar,
  Footer,
  Home,
  Login,
  Signup,
  AuthProvider,
  PrivateRoute,
  CreatePost,
  Feed,
  Post
} from "./components";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="nowuknow-app">
          <Navbar />
          <main className="nowuknow-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" />} />
             <Route path="/createPost" element={<CreatePost />} />{" "}
            <Route path="/feed" element={<Feed />} />{" "}
            <Route path="/post" element={<Post />} />{" "}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
