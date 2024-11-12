import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchCategorias } from "../../services/categoriaService";
import { fetchCertificacoes } from "../../services/certificacaoService";
import { publicaPostagem } from "../../services/postagemService";
import { publicaDiscussao } from "../../services/discussaoService";
import { publicaConteudo } from "../../services/conteudoService";

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
  const [conteudoArquivo, setConteudoArquivo] = useState(null);
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

  const handleArquivoChange = (e) => {
    const file = e.target.files[0];
    setConteudoArquivo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !tipoConteudo || !categoriaId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const postData = {
      titulo: title,
      tipoPostagem: tipoConteudo,
      autorId: 1,
      categoriaId: parseInt(categoriaId),
      certificacaoId: parseInt(certificacaoId),
    };

    try {
      const response = await publicaPostagem(postData);
      if (response) {
        const postagemId = response.id;

        if (tipoConteudo === "discussao") {
          const postDataDiscussao = {
            postagemId: postagemId,
            tipoDiscussao: tipoDiscussao,
            texto: texto,
          };
          const responseDiscussao = await publicaDiscussao(postDataDiscussao);

          if (!responseDiscussao) {
            console.log("Erro desconhecido ao criar discussão");
          }
        }
        else if (tipoConteudo === "conteudo") {
          const conteudoData = new FormData();
          conteudoData.append("postagem_id", postagemId);
          conteudoData.append("tipo_conteudo", tipoConteudoDetalhado);
          if (conteudoArquivo) {
            conteudoData.append("arquivo", conteudoArquivo);
          }

          conteudoData.append("descricao", descricao);

          const responseConteudo = await publicaConteudo(conteudoData);

          if (!responseConteudo) {
            console.log("Erro desconhecido ao criar conteúdo");
          }
        }

        navigate("/");
      } else {
        alert("Erro ao cadastrar postagem: Erro desconhecido.");
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    }

    setTitle("");
    setTipoConteudo("");
    setCategoriaId("");
    setCertificacaoId("");
    setTipoConteudoDetalhado("");
    setUrl("");
    setDescricao("");
    setConteudoArquivo(null);
  };

  return (
    <div className="nowuknow-box-container">
      <h2>Criar uma Nova Postagem</h2>
      <form onSubmit={handleSubmit} className="nowuknow-form-container">
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Campos existentes */}
        <div className="mb-3">
          <label>Título:</label>
          <input
            type="text"
            className="nowuknow-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Preencha o título"
            required
          />
        </div>

        <div className="mb-3">
          <label>Tipo de Conteúdo:</label>
          <select
            className="nowuknow-input"
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
            <div className="mb-3">
              <label>Tipo de Discussão:</label>
              <select
                className="nowuknow-input"
                value={tipoDiscussao}
                onChange={(e) => setTipoDiscussao(e.target.value)}
                required
              >
                <option value="">Selecione o tipo de discussão</option>
                <option value="duvida">Dúvida</option>
                <option value="tutorial">Tutorial</option>
              </select>
            </div>
            <div className="mb-3">
              <label>Texto:</label>
              <textarea
                className="nowuknow-input"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escreva o texto da discussão"
                required
              />
            </div>
          </>
        )}

        {/* Campos novos para upload de conteúdo */}
        {tipoConteudo === "conteudo" && (
          <>
            <div className="mb-3">
              <label>Tipo de Conteúdo Detalhado:</label>
              <select
                className="nowuknow-input"
                value={tipoConteudoDetalhado}
                onChange={(e) => setTipoConteudoDetalhado(e.target.value)}
                required
              >
                <option value="">Selecione o tipo de conteúdo</option>
                <option value="Video">Vídeo</option>
                <option value="Material_de_Aprendizado">
                  Material de Aprendizado
                </option>
              </select>
            </div>
            <div className="mb-3">
              <label>Descrição (opcional):</label>
              <textarea
                className="nowuknow-input"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição do conteúdo"
              />
            </div>
            <div className="mb-3">
              <label>Upload de Arquivo:</label>
              <input
                type="file"
                className="nowuknow-input"
                onChange={handleArquivoChange}
                accept="video/*, application/pdf, application/vnd.ms-powerpoint, application/msword"
              />
            </div>
          </>
        )}

        {/* Campos de categoria e certificação */}
        <div className="mb-3">
          <label>Categoria:</label>
          <select
            className="nowuknow-input"
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

        <div className="mb-3">
          <label>Certificação:</label>
          <select
            className="nowuknow-input"
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

        <button type="submit" className="nowuknow-btn">
          Postar
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
