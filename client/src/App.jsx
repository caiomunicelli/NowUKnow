import React, { useState } from "react";
import "./App.css";
import {
  Navbar,
  Footer,
  Home,
  Login,
  Signup,
  CreatePost,
  Feed,
  Post,
  Perfil,
  About,
  PrivateRoute,
  Categorias,
  Categoria,
  Sidebar,
} from "./components";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="nowuknow-app">
          <Navbar
            isLoginMenuOpen={isLoginMenuOpen}
            setIsLoginMenuOpen={setIsLoginMenuOpen}
          />
          <main className="nowuknow-main">
            <div className="nowuknow-left-container"></div>
            <div className="nowuknow-middle-container">
              <Routes>
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/" element={<Home />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/categoria/:id" element={<Categoria />} />
                <Route
                  path="/signup"
                  element={
                    <Signup onLoginClick={() => setIsLoginMenuOpen(true)} />
                  }
                />
                <Route path="/feed" element={<Feed />} />
                <Route path="/post" element={<Post />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/perfil"
                  element={
                    <PrivateRoute>
                      <Perfil />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/createPost"
                  element={
                    <PrivateRoute>
                      <CreatePost />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
            <div className="nowuknow-right-container"></div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
