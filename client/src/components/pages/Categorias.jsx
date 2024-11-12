import React, { useEffect, useState } from "react";
import { fetchCategorias } from "../../services/categoriaService";
import { useNavigate } from "react-router-dom";

import "./Categorias.css";


const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const categoriasData = await fetchCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    loadCategorias();
  }, []);
  const navigate = useNavigate();
  const handleViewContent = (categoriaId) => {
    navigate(`/categoria/${categoriaId}`);
  };

  return (
    <div className="nowuknow-box-container">
      <h1>Categorias de Aprendizado</h1>
      <div className="nowuknow-categorias-lista">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="nowuknow-categoria">
            <div className="nowuknow-categoria-img-nome">
              <img
                src={categoria.imagem}
                alt={categoria.nome}
                className="nowuknow-categoria-imagem"
              />
              <h2>{categoria.nome}</h2>
            </div>
            <p>{categoria.descricao}</p>
            <div className="nowuknow-categoria-btn-div">
              <button
                className="nowuknow-btn nowuknow-categoria-btn"
                onClick={() => handleViewContent(categoria.id)}
              >
                Ver conteúdos e certificações
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriasPage;
