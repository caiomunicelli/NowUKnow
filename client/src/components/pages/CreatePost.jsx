import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchCategorias } from "../../services/categoriaService";
import { fetchCertificacoes } from "../../services/certificacaoService";
import { publicaPostagem } from "../../services/postagemService";
import { publicaDiscussao } from "../../services/discussaoService";
const CreatePost = () => {
  const { error } = useAuthContext();
  const [title, setTitle] = useState("");
  const [tipoConteudo, setTipoConteudo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [certificacaoId, setCertificacaoId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [certificacoes, setCertificacoes] = useState([]);
  const [tipoDiscussao, setTipoDiscussao] = useState("");
  const [texto, setTexto] = useState("");
  const [tipoConteudoDetalhado, setTipoConteudoDetalhado] = useState("");
  const [url, setUrl] = useState("");
  const [descricao, setDescricao] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getCategorias = async () => {
      try {
        const data = await fetchCategorias();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    const getCertificacoes = async () => {
      try {
        const data = await fetchCertificacoes();
        setCertificacoes(data);
      } catch (error) {
        console.error("Erro ao carregar certificações:", error);
      }
    };

    getCategorias();
    getCertificacoes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await publicaPostagem(postData);
      if (response) {
         const postagemId = response.id;
        console.log(response);
        if (tipoConteudo === "discussao") {
          const postDataDiscussao = {
            postagemId: postagemId,
            tipoDiscussao: tipoDiscussao,
            texto: texto, // Ajuste conforme necessário
          };
          const responseDiscussao = publicaDiscussao(postDataDiscussao); 
          if (!responseDiscussao) {
              console.log("Erro desconhecido. Ao criar discussão")
          }
         
        } else if (tipoConteudo === "conteudo") {
          await createConteudo({
            postagemId,
            tipoConteudo: tipoConteudoDetalhado,
            url,
            descricao,
          });
        }

        navigate("/feed");
      } else {
        alert("Erro ao cadastrar postagem: " + ( "Erro desconhecido."));
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    }

    setTitle("");
    setTipoConteudo("");
    setCategoriaId("");
    setCertificacaoId("");
  };

  const createDiscussao = async (discussaoData) => {
      let sucesso = publicaDiscussao(discussaoData); 
      return sucesso; 
  };

  const createConteudo = async (conteudoData) => {
    // Implementar lógica de requisição POST para criar o conteúdo
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
          <select
            value={tipoConteudo}
            onChange={(e) => setTipoConteudo(e.target.value)}
            required
          >
            <option value="">Selecione o tipo de conteúdo</option>
            <option value="discussao">Discussão</option>
            <option value="conteudo">Conteúdo</option>
          </select>
        </div>

        {tipoConteudo === "discussao" && (
          <>
            <div className="form-group">
              <label>Tipo de Discussão:</label>
              <select
                value={tipoDiscussao}
                onChange={(e) => setTipoDiscussao(e.target.value)}
                required
              >
                <option value="">Selecione o tipo de discussão</option>
                <option value="duvida">Dúvida</option>
                <option value="tutorial">Tutorial</option>
              </select>
            </div>
            <div className="form-group">
              <label>Texto:</label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escreva o texto da discussão"
                required
              />
            </div>
          </>
        )}

        {tipoConteudo === "conteudo" && (
          <>
            <div className="form-group">
              <label>Tipo de Conteúdo:</label>
              <select
                value={tipoConteudoDetalhado}
                onChange={(e) => setTipoConteudoDetalhado(e.target.value)}
                required
              >
                <option value="">Selecione o tipo de conteúdo</option>
                <option value="video">Vídeo</option>
                <option value="material_de_aprendizado">Material de Aprendizado</option>
              </select>
            </div>
            <div className="form-group">
              <label>URL:</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Informe o URL"
                required
              />
            </div>
            <div className="form-group">
              <label>Descrição (opcional):</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição do conteúdo"
              />
            </div>
          </>
        )}

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
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Certificação:</label>
          <select
            value={certificacaoId}
            onChange={(e) => setCertificacaoId(e.target.value)}
          >
            <option value="">Selecione uma certificação</option>
            {certificacoes.map((cert) => (
              <option key={cert.id} value={cert.id}>
                {cert.nome}
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
