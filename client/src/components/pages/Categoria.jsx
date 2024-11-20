import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Feed from "../Feed";
import "./Categorias.css";

const FeedCategoria = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [certificacoes, setCertificacoes] = useState([]);
  const [categoria, setCategoria] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingCertificacoes, setLoadingCertificacoes] = useState(false);
  const [loadingCategoria, setLoadingCategoria] = useState(false);

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

  const fetchCertificacoesByCategoria = async () => {
    setLoadingCertificacoes(true);
    try {
      const response = await fetch(`/api/v1/certificacoes/categoria/${id}`);
      const categoriaCertificacoes = await response.json();
      setCertificacoes(categoriaCertificacoes);
    } catch (error) {
      console.error("Erro ao carregar certificações da categoria:", error);
    } finally {
      setLoadingCertificacoes(false);
    }
  };

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

  useEffect(() => {
    if (id) {
      fetchPostsByCategoria();
      fetchCertificacoesByCategoria();
      fetchCategoriaDetails();
    }
  }, [id]);

  return (
    <div className="nowuknow-categoria-box-container">
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
      <br />
      {/* Tabs */}
      <div className="nowuknow-tabs">
        <button
          className={`nowuknow-tab ${activeTab === "posts" ? "nowuknow-active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`nowuknow-tab ${activeTab === "certificacoes" ? "nowuknow-active" : ""}`}
          onClick={() => setActiveTab("certificacoes")}
        >
          Certificações
        </button>
      </div>
      <br />
      {/* Conteúdo da aba selecionada */}
      {activeTab === "posts" ? (
        loadingPosts ? (
          <p>Carregando posts...</p>
        ) : posts.length > 0 ? (
          <Feed postagens={posts} />
        ) : (
          <p className="no-posts">Sem postagens para essa categoria.</p>
        )
      ) : activeTab === "certificacoes" ? (
        loadingCertificacoes ? (
          <p>Carregando certificações...</p>
        ) : certificacoes.length > 0 ? (
          <div className="nowuknow-categorias-lista">
            {certificacoes.map((cert) => (
              <div key={cert.id} className="nowuknow-certificacao-card">
                <img
                  src={cert.imagem}
                  alt={cert.nome}
                  className="nowuknow-certificacao-imagem"
                />
                <div className="nowuknow-certificacao-info">
                  <Link to={`/certificacao/${cert.id}`} className="nowuknow-certificacao-nome">
                    {cert.nome}
                  </Link>
                  <p className="nowuknow-certificacao-descricao">{cert.descricao}</p>
                  <p className="nowuknow-certificacao-requisitos">
                    <strong>Requisitos:</strong> {cert.requisitos}
                  </p>
                  <p className="nowuknow-certificacao-nivel">
                    <strong>Nível:</strong> {cert.nivel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Sem certificações para essa categoria.</p>
        )
      ) : null}
    </div>
  );
};

export default FeedCategoria;