import React from "react";
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
  Categoria
} from "./components";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="nowuknow-app">
          <Navbar />
          <main className="nowuknow-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categoria/:id" element={<Categoria />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" />} />

              {/* Rota privada, acessível apenas se o usuário estiver autenticado */}
              <Route
                path="/createPost"
                element={
                  <PrivateRoute>
                    <CreatePost />
                  </PrivateRoute>
                }
              />
              <Route
                path="/feed"
                element={
                    <Feed />
                }
              />
              <Route
                path="/post"
                element={
                    <Post />
                }
              />
              <Route
                path="/perfil"
                element={
                  <PrivateRoute>
                    <Perfil />
                  </PrivateRoute>
                }
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
