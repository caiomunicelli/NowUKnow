import React, { useEffect, useState } from "react";
import { fetchCategorias } from "../../services/categoriaService";

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

  const handleViewContent = (categoriaId) => {
    // Lógica para exibir conteúdos e certificações relacionados a essa categoria
    console.log(`Visualizando conteúdos para categoria com ID: ${categoriaId}`);
  };

  return (
    <div className="nowuknow-lista-categorias">
      <h1>Categorias</h1>
      <div className="categorias-list">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="nowuknow-categoria">
            <img
              src={categoria.imagem}
              alt={categoria.nome}
              className="categoria-imagem"
            />
            <h2>{categoria.nome}</h2>
            <p>{categoria.descricao}</p>
            <button onClick={() => handleViewContent(categoria.id)}>
              Ver conteúdos e certificações
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriasPage;
