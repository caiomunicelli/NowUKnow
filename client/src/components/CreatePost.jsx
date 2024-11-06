import React, { useState } from 'react';
import './CreatePost.css';

const CreatePost = ({ onSubmitPost }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tipoConteudo, setTipoConteudo] = useState('');
  const [nivelDificuldade, setNivelDificuldade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title && description && tipoConteudo && nivelDificuldade   && categoria && imageUrl) {
      onSubmitPost({ title, description, tipoConteudo, nivelDificuldade , categoria, imageUrl });
      setTitle('');
      setDescription('');
      setTipoConteudo('');
      setNivelDificuldade('');
      setCategoria('');
      setImageUrl('');
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