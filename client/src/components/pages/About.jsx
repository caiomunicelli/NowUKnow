import React, { useState, useEffect } from "react";

const AutoresList = () => {
  const [autores, setAutores] = useState([]);

  useEffect(() => {
    // Faz uma requisição para obter os autores
    const fetchAutores = async () => {
      try {
        const response = await fetch("/api/v1/about");
        const data = await response.json();
        setAutores(data);
      } catch (error) {
        console.error("Erro ao buscar autores:", error);
      }
    };

    fetchAutores();
  }, []); // [] indica que o efeito só roda uma vez ao carregar o componente

  return (
    <div>
      <h2>Lista de Autores</h2>
      <ul>
        {autores.map((autor, index) => (
          <li key={index}>
            Nome: {autor.nome}, RA: {autor.ra}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoresList;
