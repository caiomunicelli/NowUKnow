import React, { useState } from "react";
import "./CreatePost.css";
import { useAuth } from "../../hooks/useAuth"; // Importando o useAuth para acessar o token
import { useNavigate } from "react-router-dom"; // Importando o useNavigate para navegação dinâmica

const CreatePost = () => {
  const { isAuthenticated, error, logout } = useAuth(); // Usando o useAuth para obter o estado de autenticação
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tipoConteudo, setTipoConteudo] = useState("");
  const [nivelDificuldade, setNivelDificuldade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate(); // Criando a função de navegação

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtendo o token de autenticação através do hook useAuth
    const token = localStorage.getItem("authToken"); // Ou use o método adequado para obter o token de seu estado global

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (
      !title ||
      !description ||
      !tipoConteudo ||
      !nivelDificuldade ||
      !categoria ||
      !imageUrl
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    // Monta o objeto postData
    const postData = {
      titulo: title,
      descricao: description,
      tipo_conteudo: tipoConteudo,
      nivel_dificuldade: nivelDificuldade,
      categoria: categoria,
      imagem_url: imageUrl,
    };

    try {
      // Realiza a requisição POST
      const response = await fetch("/api/v1/conteudos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token, // Usando o token obtido do hook useAuth
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        // Se a resposta for OK, navega para a página de feed ou home
        navigate("/feed");
      } else {
        const errorData = await response.json().catch(() => response.text());
        alert(
          "Erro ao cadastrar conteúdo: " + (errorData || "Erro desconhecido.")
        );
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    }

    // Após o envio, limpa os campos do formulário
    setTitle("");
    setDescription("");
    setTipoConteudo("");
    setNivelDificuldade("");
    setCategoria("");
    setImageUrl("");
  };

  return (
    <div className="new-post-form">
      <h2>Criar um Novo Post</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}{" "}
        {/* Exibe erros acima do formulário */}
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
          <label>Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Preencha a descrição"
            required
          />
        </div>
        <div className="form-group">
          <label>Tipo de conteúdo:</label>
          <input
            type="text"
            value={tipoConteudo}
            onChange={(e) => setTipoConteudo(e.target.value)}
            placeholder="Preencha o tipo de conteúdo"
            required
          />
        </div>
        <div className="form-group">
          <label>Nível de dificuldade:</label>
          <input
            type="text"
            value={nivelDificuldade}
            onChange={(e) => setNivelDificuldade(e.target.value)}
            placeholder="Preencha o nível de dificuldade"
            required
          />
        </div>
        <div className="form-group">
          <label>Categoria:</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Preencha a categoria"
            required
          />
        </div>
        <div className="form-group">
          <label>URL da Imagem:</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Preencha a URL da imagem"
            required
          />
        </div>
        <button type="submit">Postar</button>
      </form>
    </div>
  );
};

export default CreatePost;
