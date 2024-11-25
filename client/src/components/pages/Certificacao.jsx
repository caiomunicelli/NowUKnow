import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Feed from "../Feed";
import "./Certificacao.css";

const FeedCertificacao = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [certificacao, setCertificacao] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingCertificacao, setLoadingCertificacao] = useState(false);

  const fetchPostsByCertificacao = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch(`/api/v1/postagens/certificacao/${id}`);
      const certificacaoPosts = await response.json();
      setPosts(certificacaoPosts);
    } catch (error) {
      console.error("Erro ao carregar posts da certificação:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchCertificacao = async () => {
    setLoadingCertificacao(true);
    try {
      const response = await fetch(`/api/v1/certificacoes/${id}`);
      const certificacaoData = await response.json();
      setCertificacao(certificacaoData);
    } catch (error) {
      console.error("Erro ao carregar certificação:", error);
    } finally {
      setLoadingCertificacao(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostsByCertificacao();
      fetchCertificacao();
    }
  }, [id]);

  return (
    <div className="nowuknow-certificacao-box-container">
      {/* Exibição da certificação */}
      {loadingCertificacao ? (
        <p>Carregando certificação...</p>
      ) : certificacao ? (
        <div>
          <div key={certificacao.id} className="nowuknow-certificacao-card">
            <img
              src={certificacao.imagem}
              alt={certificacao.nome}
              className="nowuknow-certificacao-imagem"
            />
            <div className="nowuknow-certificacao-info">
              <h3 className="nowuknow-certificacao-nome">
                {certificacao.nome}
              </h3>
              <p className="nowuknow-certificacao-descricao">
                {certificacao.descricao}
              </p>
              <p className="nowuknow-certificacao-requisitos">
                <strong>Requisitos:</strong> {certificacao.requisitos}
              </p>
              <p className="nowuknow-certificacao-nivel">
                <strong>Nível:</strong> {certificacao.nivel}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>Sem detalhes da certificação.</p>
      )}

      {/* Exibição dos posts */}
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