import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCategorias } from "../../services/categoriaService";
import { fetchCertificacoes } from "../../services/certificacaoService";
import { publicaPostagem, editaPostagem } from "../../services/postagemService";
import {
  publicaDiscussao,
  editaDiscussao,
} from "../../services/discussaoService";
import { publicaConteudo, editaConteudo } from "../../services/conteudoService";

const CreatePost = () => {
  const { error } = useAuthContext();
  const location = useLocation();
  const postagem = location.state?.postagem || null;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tipoPostagem, setTipoPostagem] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [certificacaoId, setCertificacaoId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [certificacoes, setCertificacoes] = useState([]);
  const [certificacoesFiltradas, setCertificacoesFiltradas] = useState([]);
  const [tipoDiscussao, setTipoDiscussao] = useState("");
  const [texto, setTexto] = useState("");
  const [tipoConteudo, setTipoConteudo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [conteudoArquivo, setConteudoArquivo] = useState(null);
  const [previewConteudoArquivo, setPreviewConteudoArquivo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (postagem) {
      setTitle(postagem.postagem_titulo || "");
      setTipoPostagem(postagem.postagem_tipo || "");
      setCategoriaId(postagem.categoria_id || "");
      setCertificacaoId(postagem.certificacao_id || "");

      if (postagem.postagem_tipo === "Conteudo") {
        setTipoConteudo(postagem.conteudo_tipo || "");
        setDescricao(postagem.conteudo_descricao || "");
        setPreviewConteudoArquivo(postagem.conteudo_url || null);
      }

      if (postagem.postagem_tipo === "Discussao") {
        setTipoDiscussao(postagem.discussao_tipo || "");
        setTexto(postagem.discussao_texto || "");
      }
    }
  }, [postagem]);

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

  const handleCategoriaChange = (value) => {
    console.log(value);
    setCategoriaId(value);
    console.log(JSON.stringify(certificacoes));
    const categoriaIdNumerico = Number(value);
    const certificacoesPorCategoria = certificacoes.filter((certificacao) => {
      return certificacao.categoriaId === categoriaIdNumerico;
    });
    setCertificacoesFiltradas(certificacoesPorCategoria);
  };

  const handleArquivoChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPreviewConteudoArquivo(null);
      return;
    }

    if (tipoConteudo === "Video") {
      const fileUrl = URL.createObjectURL(file);
      setPreviewConteudoArquivo(fileUrl);
    } else if (tipoConteudo === "Material_de_Aprendizado") {
      setPreviewConteudoArquivo(file.name);
    }

    setConteudoArquivo(file);
  };

  useEffect(() => {
    return () => {
      if (previewConteudoArquivo) {
        URL.revokeObjectURL(previewConteudoArquivo);
      }
    };
  }, [previewConteudoArquivo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !tipoPostagem || !categoriaId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const postData = {
      titulo: title,
      tipoPostagem: tipoPostagem,
      autorId: 1,
      categoriaId: parseInt(categoriaId),
      certificacaoId: parseInt(certificacaoId),
    };

    try {
      setIsUploading(true);
      let response = null;

      if (postagem) {
        response = await editaPostagem(postData, postagem.postagem_id);
      } else {
        response = await publicaPostagem(postData);
      }

      if (response) {
        const postagemId = postagem ? postagem.postagem_id : response.id;

        if (tipoPostagem === "Discussao") {
          const postDataDiscussao = {
            postagemId: postagemId,
            tipoDiscussao: tipoDiscussao,
            texto: texto,
          };
          if (postagem) {
            await editaDiscussao(postDataDiscussao, postagem.discussao_id);
          } else {
            await publicaDiscussao(postDataDiscussao);
          }
        } else if (tipoPostagem === "Conteudo") {
          const conteudoData = new FormData();
          conteudoData.append("postagem_id", postagemId);
          conteudoData.append("tipo_conteudo", tipoConteudo);
          if (conteudoArquivo) {
            conteudoData.append("arquivo", conteudoArquivo);
          }
          conteudoData.append("descricao", descricao);

          if (postagem) {
            await editaConteudo(conteudoData, postagem.conteudo_id);
          } else {
            await publicaConteudo(conteudoData);
          }
        }

        navigate("/");
      } else {
        alert("Erro ao cadastrar ou editar postagem.");
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="nowuknow-box-container">
      <h2>{postagem ? "Editar Postagem" : "Criar uma Nova Postagem"}</h2>
      <form onSubmit={handleSubmit} className="nowuknow-form-container">
        {error && <div className="alert alert-danger">{error}</div>}

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
          <label>Categoria:</label>
          <select
            className="nowuknow-input"
            value={categoriaId}
            onChange={(e) => {
              setCategoriaId(e.target.value);
              handleCategoriaChange(e.target.value);
            }}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        {categoriaId !== "" && (
          <div className="mb-3">
            <label>Certificação (Opcional):</label>
            <select
              className="nowuknow-input"
              value={certificacaoId}
              onChange={(e) => setCertificacaoId(e.target.value)}
            >
              <option value="">Selecione uma certificação</option>
              {certificacoesFiltradas.map((cert) => (
                <option key={cert.id} value={cert.id}>
                  {cert.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label>Tipo de Postagem:</label>
          <select
            className="nowuknow-input"
            value={tipoPostagem}
            onChange={(e) => setTipoPostagem(e.target.value)}
            required
            disabled={!!postagem}
          >
            <option value="">Selecione o tipo de postagem</option>
            <option value="Discussao">Discussão</option>
            <option value="Conteudo">Conteúdo</option>
          </select>
        </div>

        {tipoPostagem && (
          <div>
            {tipoPostagem === "Conteudo" && (
              <div>
                <div className="mb-3">
                  <label>Tipo de Conteúdo:</label>
                  <select
                    className="nowuknow-input"
                    value={tipoConteudo}
                    onChange={(e) => setTipoConteudo(e.target.value)}
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Video">Vídeo</option>
                    <option value="Material_de_Aprendizado">
                      Material de Aprendizado
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label>Descrição:</label>
                  <textarea
                    className="nowuknow-input"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva o conteúdo"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Arquivo de Conteúdo:</label>
                  <input
                    type="file"
                    onChange={handleArquivoChange}
                    accept="video/*,.pdf,.doc,.docx,.ppt,.pptx"
                  />
                  {previewConteudoArquivo && (
                    <div className="file-preview">
                      {tipoConteudo === "Video" ? (
                        <video
                          src={previewConteudoArquivo}
                          controls
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <span>{previewConteudoArquivo}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tipoPostagem === "Discussao" && (
              <div>
                <div className="mb-3">
                  <label>Tipo de Discussão:</label>
                  <select
                    className="nowuknow-input"
                    value={tipoDiscussao}
                    onChange={(e) => setTipoDiscussao(e.target.value)}
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Duvida">Dúvida</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label>Texto da Discussão:</label>
                  <textarea
                    className="nowuknow-input"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Descreva sua dúvida ou tutorial"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-3">
          <button type="submit" className="nowuknow-btn" disabled={isUploading}>
            {isUploading
              ? "Publicando..."
              : postagem
              ? "Salvar Alterações"
              : "Publicar nova Postagem"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
