import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Feed from "../Feed";
import "./Categorias.css";

const FeedCategoria = () => {
  const { id } = useParams(); // Captura o id da categoria da URL
  const [posts, setPosts] = useState([]);
  const [categoria, setCategoria] = useState(null); // Estado para armazenar os dados da categoria
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingCategoria, setLoadingCategoria] = useState(false);

  // Função para buscar posts filtrados por categoria
  const fetchPostsByCategoria = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch(`/api/v1/postagens/allDetails/${id}`);
      const categoriaPosts = await response.json();
      setPosts(categoriaPosts);
    } catch (error) {
      console.error("Erro ao carregar posts da categoria:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Função para buscar detalhes da categoria
  const fetchCategoriaDetails = async () => {
    setLoadingCategoria(true);
    try {
      const response = await fetch(`/api/v1/categorias/${id}`);
      const categoriaData = await response.json();
      setCategoria(categoriaData);
    } catch (error) {
      console.error("Erro ao carregar detalhes da categoria:", error);
    } finally {
      setLoadingCategoria(false);
    }
  };

  // Fetch inicial (carregado apenas uma vez)
  useEffect(() => {
    if (id) {
      fetchPostsByCategoria();
      fetchCategoriaDetails();
    }
  }, [id]);

  return (
    <div className="nowuknow-box-container">
      {/* Seção de detalhes da categoria */}
      {loadingCategoria ? (
        <p>Carregando detalhes da categoria...</p>
      ) : categoria ? (
        <div className="nowuknow-categoria">
          <div className="nowuknow-categoria-img-nome">
              <img
                src={categoria.imagem}
                alt={categoria.nome}
                className="nowuknow-categoria-imagem"
              />
              <h2>{categoria.nome}</h2>
            </div>
            <p>{categoria.descricao}</p>
        </div>
      ) : (
        <p>Categoria não encontrada.</p>
      )}

      {/* Lista de posts da categoria */}
      {loadingPosts ? (
        <p>Carregando posts...</p>
      ) : posts.length > 0 ? (
        <Feed posts={posts} /> // Passa os posts filtrados para o componente Feed
      ) : (
        <p className="no-posts">Sem postagens para essa categoria.</p>
      )}
    </div>
  );
};

export default FeedCategoria;
