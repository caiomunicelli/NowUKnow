import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Feed from "../Feed";
import "./Certificacao.css";

const FeedCertificacao = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]); // Feed de posts permanece
  const [certificacoes, setCertificacoes] = useState([]); // Lista de certificações
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingCertificacoes, setLoadingCertificacoes] = useState(false); // Estado de carregamento das certificações

  const fetchPostsByCertificacao = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch(`/api/v1/postagens/certificacao/${id}`);
      const categoriaPosts = await response.json();
      setPosts(categoriaPosts);
    } catch (error) {
      console.error("Erro ao carregar posts da certificação:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchCertificacoes = async () => {
    setLoadingCertificacoes(true);
    try {
      const response = await fetch(`/api/v1/certificacoes/${id}`);
      const certificacoesData = await response.json();
      setCertificacoes(certificacoesData);
    } catch (error) {
      console.error("Erro ao carregar certificações:", error);
    } finally {
      setLoadingCertificacoes(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostsByCertificacao();
      fetchCertificacoes();
    }
  }, [id]);

  return (
    <div className="nowuknow-categoria-box-container">
      {/* Exibição das certificações */}
      {loadingCertificacoes ? (
        <p>Carregando certificações...</p>
      ) : certificacoes ? (
        <div className="nowuknow-certificacoes-container">
            <div key={certificacoes.id} className="nowuknow-certificacao-card">
              <img
                src={certificacoes.imagem}
                alt={certificacoes.nome}
                className="nowuknow-certificacao-imagem"
              />
              <div className="nowuknow-certificacao-info">
                <h3 className="nowuknow-certificacao-nome">
                  {certificacoes.nome}
                </h3>
                <p className="nowuknow-certificacao-descricao">
                  {certificacoes.descricao}
                </p>
                <p className="nowuknow-certificacao-requisitos">
                  <strong>Requisitos:</strong> {certificacoes.requisitos}
                </p>
                <p className="nowuknow-certificacao-nivel">
                  <strong>Nível:</strong> {certificacoes.nivel}
                </p>
              </div>
            </div>
        </div>
      ) : (
        <p>Sem certificações para esta categoria.</p>
      )}

      {/* Exibição dos posts, se necessário */}
      {loadingPosts ? (
        <p>Carregando posts...</p>
      ) : posts.length > 0 ? (
        <Feed postagens={posts} />
      ) : (
        <p className="no-posts">Sem postagens para essa certificação.</p>
      )}
    </div>
  );
};

export default FeedCertificacao;
