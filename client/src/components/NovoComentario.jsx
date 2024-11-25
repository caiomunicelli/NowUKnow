import React, { useState } from "react";
import { getToken } from "../services/authService";
import "./NovoComentario.css";

const NovoComentario = ({ postagemId, onComentarioCriado }) => {
  const [novoComentario, setNovoComentario] = useState("");
  const [erroComentario, setErroComentario] = useState("");
  const [loadingCriarComentario, setLoadingCriarComentario] = useState(false);

  const criarComentario = async () => {
    if (!novoComentario.trim()) {
      setErroComentario("O comentário não pode estar vazio!");
      return;
    }

    setErroComentario("");
    setLoadingCriarComentario(true);

    try {
      const token = getToken();
      if (!token) throw new Error("Usuário não autenticado");

      const response = await fetch("/api/v1/comentarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          postagemId,
          usuarioId: 0,
          texto: novoComentario,
          parentId: null,
        }),
      });

      if (response.ok) {
        onComentarioCriado(); // Chama o callback para atualizar os comentários
        setNovoComentario("");
      } else {
        const errorText = await response.text();
        setErroComentario(`Erro ao criar comentário: ${errorText}`);
        console.error("Erro ao criar comentário:", errorText);
      }
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      setErroComentario(`Erro ao criar comentário: ${error.message}`);
    } finally {
      setLoadingCriarComentario(false);
    }
  };

  const isComentarioValido = novoComentario.trim().length > 0;

  return (
    <div className="nowuknow-novocomentario-container">
      <div className="nowuknow-nono-comentario">
        <textarea
          id="novoComentario"
          className="nowuknow-input"
          placeholder="Escreva seu comentário aqui..."
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          rows="3"
        />
        {erroComentario && <p className="erro-comentario">{erroComentario}</p>}
        <button
          className="nowuknow-btn"
          onClick={criarComentario}
          disabled={loadingCriarComentario || !isComentarioValido}
        >
          {loadingCriarComentario ? "Criando..." : "Comentar"}
        </button>
      </div>
    </div>
  );
};

export default NovoComentario;
