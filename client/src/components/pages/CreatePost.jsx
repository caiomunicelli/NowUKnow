import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCategorias } from "../../services/categoriaService";
import { fetchCertificacoes } from "../../services/certificacaoService";
// Método para buscar conteúdo
import { publicaPostagem, editaPostagem } from "../../services/postagemService";
import {
  publicaDiscussao,
  editaDiscussao,
  pegaDiscussao,
} from "../../services/discussaoService";
import {
  publicaConteudo,
  editaConteudo,
  pegaConteudo,
} from "../../services/conteudoService";

const CreatePost = () => {
  const { error } = useAuthContext();
  const location = useLocation();
  const postagem = location.state?.postagem || null; // Pegando a postagem do state, se existir
  const navigate = useNavigate();
  const [conteudo, setConteudo] = useState(null);
  const [discussao, setDiscussao] = useState();
  const [title, setTitle] = useState("");
  const [tipoConteudo, setTipoConteudo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [certificacaoId, setCertificacaoId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [certificacoes, setCertificacoes] = useState([]);
  const [tipoDiscussao, setTipoDiscussao] = useState("");
  const [texto, setTexto] = useState("");
  const [tipoConteudoDetalhado, setTipoConteudoDetalhado] = useState("");
  const [descricao, setDescricao] = useState("");
  const [conteudoArquivo, setConteudoArquivo] = useState(null);
  const [previewConteudoArquivo, setPreviewConteudoArquivo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Efeito para preencher os campos quando uma postagem existente for editada
  useEffect(() => {
    if (postagem) {
      setTitle(postagem.titulo || "");
      setTipoConteudo(postagem.tipo_postagem || "");
      setCategoriaId(postagem.categoria_id || "");
      setCertificacaoId(postagem.certificacao_id || "");

      // Se for "conteudo", buscar detalhes do conteúdo
      if (postagem.tipo_postagem === "conteudo") {
        pegaConteudo(postagem.id).then((conteudo) => {
          setConteudo(conteudo);
          setTipoConteudoDetalhado(conteudo.tipo_conteudo || "");
          setDescricao(conteudo.descricao || "");
          setConteudoArquivo(conteudo.url || null);
        });
      }

      // Se for "discussao", preencher texto e tipo de discussão
      if (postagem.tipoPostagem === "discussao") {
        pegaDiscussao(postagem.id).then((discussao) => {
          setDiscussao(discussao);
          setTipoDiscussao(discussao.tipo_discussao || "");
          setTexto(discussao.texto || "");
        });
      }
    }
  }, [postagem]);

  // Buscar categorias e certificações
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

  // Manter o arquivo ao selecionar outro
  const handleArquivoChange = (e) => {
    const file = e.target.files[0];
    setConteudoArquivo(file);
  };

  // Enviar formulário de criação ou edição
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !tipoConteudo || !categoriaId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const postData = {
      titulo: title,
      tipoPostagem: tipoConteudo,
      autorId: 1, // Este valor deveria vir do contexto de autenticação
      categoriaId: parseInt(categoriaId),
      certificacaoId: parseInt(certificacaoId),
    };

    try {
      setIsUploading(true);
      let response = null;

      if (postagem) {
        // Atualizando postagem existente
        response = await editaPostagem(postData, postagem.id);
      } else {
        // Criando nova postagem
        response = await publicaPostagem(postData);
      }

      if (response) {
        const postagemId = response.id;

        // Se for "discussao", cria ou atualiza a discussão
        if (tipoConteudo === "discussao") {
          const postDataDiscussao = {
            postagemId: postagemId,
            tipoDiscussao: tipoDiscussao,
            texto: texto,
          };
          // Se a postagem for uma edição, atualize a discussão
          if (postagem) {
            await editaDiscussao(postDataDiscussao, postagem.id);
          } else {
            await publicaDiscussao(postDataDiscussao);
          }
        } else if (tipoConteudo === "conteudo") {
          // Se for "conteudo", cria ou atualiza o conteúdo
          const conteudoData = new FormData();
          conteudoData.append("postagem_id", postagemId);
          conteudoData.append("tipo_conteudo", tipoConteudoDetalhado);
          if (conteudoArquivo) {
            conteudoData.append("arquivo", conteudoArquivo);
          }
          conteudoData.append("descricao", descricao);

          // Se a postagem for uma edição, atualize o conteúdo
          if (postagem) {
            await editaConteudo(conteudoData, postagem.id);
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
                placeholder="Adicione uma descrição"
              />
            </div>
            <div className="mb-3">
              <label>Arquivo (se aplicável):</label>
              <input
                type="file"
                className="nowuknow-input"
                onChange={handleArquivoChange}
              />
            </div>
          </>
        )}

        <div className="mb-3">
          <label>Categoria:</label>
          <select
            className="nowuknow-input"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
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

        <div className="mb-3">
          <label>Certificação:</label>
          <select
            className="nowuknow-input"
            value={certificacaoId}
            onChange={(e) => setCertificacaoId(e.target.value)}
          >
            <option value="">Selecione uma certificação</option>
            {certificacoes.map((certificacao) => (
              <option key={certificacao.id} value={certificacao.id}>
                {certificacao.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <button
            type="submit"
            className="nowuknow-submit-button"
            disabled={isUploading}
          >
            {isUploading
              ? "Carregando..."
              : postagem
              ? "Atualizar Postagem"
              : "Criar Postagem"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
