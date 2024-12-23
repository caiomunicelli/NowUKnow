import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Feed from "../../components/Feed";
import CategoriasPage from "./Categorias";
import UsuariosPage from "../Usuarios";
import "./Resultados.css";

function ResultsPage() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extrai os parâmetros da query string
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const filter = queryParams.get("filter");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/v1/pesquisas?query=${encodeURIComponent(
            query
          )}&filter=${encodeURIComponent(filter)}`
        );

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError("Erro ao buscar resultados. Tente novamente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, filter]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="nowuknow-resultados-container">
      <h1>Resultados para "{query}"</h1>
      {filter === "conteudo" && results.length > 0 ? (
        <Feed postagens={results} />
      ) : filter === "categoria" && results.length > 0 ? (
        <CategoriasPage categoriasFiltradas={results} hide={true} />
      ) : filter === "autor" && results.length > 0 ? (
        <UsuariosPage usuariosFiltrados={results} />
      ) : (
        <p>Nenhum resultado encontrado.</p>
      )}
    </div>
  );
}

export default ResultsPage;
