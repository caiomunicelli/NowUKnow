import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { error } = useAuthContext();
  const [title, setTitle] = useState("");
  const [tipoConteudo, setTipoConteudo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [certificacaoId, setCertificacaoId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [certificacoes, setCertificacoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("/api/v1/categorias");
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    const fetchCertificacoes = async () => {
      try {
        const response = await fetch("/api/v1/certificacoes");
        const data = await response.json();
        setCertificacoes(data);
      } catch (error) {
        console.error("Erro ao carregar certificações:", error);
      }
    };

    fetchCategorias();
    fetchCertificacoes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!title || !tipoConteudo || !categoriaId || !certificacaoId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const postData = {
      titulo: title,
      tipoPostagem: tipoConteudo,
      autorId: 1, // Ajuste conforme necessário
      categoriaId: parseInt(categoriaId),
      certificacaoId: parseInt(certificacaoId),
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/postagens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        navigate("/feed");
      } else {
        const errorData = await response.json().catch(() => response.text());
        alert("Erro ao cadastrar postagem: " + (errorData || "Erro desconhecido."));
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    }

    setTitle("");
    setTipoConteudo("");
    setCategoriaId("");
    setCertificacaoId("");
  };

  return (
    <div className="new-post-form">
      <h2>Criar uma Nova Postagem</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Preencha o título"
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de Conteúdo:</label>
          <input
            type="text"
            value={tipoConteudo}
            onChange={(e) => setTipoConteudo(e.target.value)}
            placeholder="Preencha o tipo de conteúdo"
            required
          />
        </div>

        <div className="form-group">
          <label>Categoria:</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.descricao}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Certificação:</label>
          <select
            value={certificacaoId}
            onChange={(e) => setCertificacaoId(e.target.value)}
            required
          >
            <option value="">Selecione uma certificação</option>
            {certificacoes.map((cert) => (
              <option key={cert.id} value={cert.id}>
                {cert.descricao}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Postar</button>
      </form>
    </div>
  );
};

export default CreatePost;
