import React, { useState } from "react";
import "./CreatePost.css";
import Cookies from "js-cookie";
import { useAuth } from "../../components"; // Importando o useAuth
import { useNavigate } from "react-router-dom"; // Importando o useNavigate para navegação dinâmica

const CreatePost = ({ onSubmitPost, navigate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tipoConteudo, setTipoConteudo] = useState("");
  const [nivelDificuldade, setNivelDificuldade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const redirect = useNavigate(); // Criando a função de navegação
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (
      title &&
      description &&
      tipoConteudo &&
      nivelDificuldade &&
      categoria &&
      imageUrl
    ) {
      // Monta o objeto postData
      const postData = {
        titulo: title,
        descricao: description,
        tipo_conteudo: tipoConteudo,
        nivel_dificuldade: nivelDificuldade,
        categoria: categoria,
      };

      try {
        // Realiza a requisição POST
        console.log(token);
        console.log(JSON.stringify(postData));
        const response = await fetch("/api/v1/conteudos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify(postData),
        });

        if (response.ok) {
          // Se a resposta for OK, navega para a página inicial
          redirect("/home");
        } else {
          // Se houver erro, tenta capturar a resposta do erro
          const errorData = await response.json().catch(() => response.text());
          console.error("Erro ao cadastrar usuário:", errorData);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }

      // Após o envio, limpa os campos do formulário
      setTitle("");
      setDescription("");
      setTipoConteudo("");
      setNivelDificuldade("");
      setCategoria("");
      setImageUrl("");
    } else {
      alert("Preencha os campos obrigatórios.");
    }
  };

  return (
    <div className="new-post-form">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titulo:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Preencha o título"
          />
        </div>

        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Preencha o Descrição"
          />
        </div>

        <div className="form-group">
          <label>Tipo de documento:</label>
          <input
            type="text"
            value={tipoConteudo}
            onChange={(e) => setTipoConteudo(e.target.value)}
            placeholder="Preencha o Tipo de documento"
          />
        </div>

        <div className="form-group">
          <label>Nível de dificuldade:</label>
          <input
            type="text"
            value={nivelDificuldade}
            onChange={(e) => setNivelDificuldade(e.target.value)}
            placeholder="Preencha nível de dificuldade"
          />
        </div>

        <div className="form-group">
          <label>Categoria:</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Preencha Categoria"
          />
        </div>

        <div className="form-group">
          <label>URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Preencha URL"
          />
        </div>

        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
