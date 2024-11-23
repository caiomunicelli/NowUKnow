import React, { useEffect, useState } from "react";
import { fetchCategorias } from "../../services/categoriaService";
import { useNavigate } from "react-router-dom";

import "./Categorias.css";

const CategoriasPage = ({ categoriasFiltradas = [] }) => {
  const [categorias, setCategorias] = useState(categoriasFiltradas);
  const [loading, setLoading] = useState(false);

  const loadCategorias = async () => {
    setLoading(true);
    try {
      if (categoriasFiltradas.length === 0) {
        const categoriasData = await fetchCategorias();
        setCategorias(categoriasData);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []); // Executa a lógica ao montar o componente

  const navigate = useNavigate();

  const handleViewContent = (categoriaId) => {
    navigate(`/categoria/${categoriaId}`);
  };

  return (
    <div className="nowuknow-box-container">
      <h1>Categorias de Aprendizado</h1>
      {loading ? (
        <p>Carregando categorias...</p>
      ) : (
        <div className="nowuknow-categorias-lista">
          {categorias.length > 0 ? (
            categorias.map((categoria) => (
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
            ))
          ) : (
            <p className="no-categorias">Nenhuma categoria disponível.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriasPage;
