import { useState } from "react";
import "./App.css";
import { Navbar, Footer, Home, Login, Signup } from "./components";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="nowuknow-app">
        <header className="nowuknow-header">
          <Navbar />
        </header>
        <main className="nowuknow-main">
          <Routes>
            <Route path="/" element={<Home />} />{" "}
            <Route path="/login" element={<Login />} />{" "}
            <Route path="/signup" element={<Signup />} />{" "}
            <Route
              render={({ location }) => {
                if (!location.pathname.startsWith("/api/")) {
                  return <Redirect to="/" />;
                }
              }}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;