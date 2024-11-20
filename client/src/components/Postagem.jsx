import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import "./Postagem.css";
import { getToken } from "../services/authService";

const Postagem = () => {
    const { id } = useParams();
    const [comentarios, setComentarios] = useState([]);
    const [postagem, setPostagem] = useState(null);
    const [loadingComentarios, setLoadingComentarios] = useState(false);
    const [loadingPostagem, setLoadingPostagem] = useState(false);
    const [novoComentario, setNovoComentario] = useState("");
    const [erroComentario, setErroComentario] = useState("");
    const [loadingCriarComentario, setLoadingCriarComentario] = useState(false);
    const { isAuthenticated } = useAuthContext();

    const fetchComentariosByPostagem = async () => {
        setLoadingComentarios(true);
        try {
            const response = await fetch(`/api/v1/comentarios/allComments/${id}`);
            const postagemComentarios = await response.json();
            setComentarios(postagemComentarios);
        } catch (error) {
            console.error("Erro ao carregar comentários da postagem:", error);
        } finally {
            setLoadingComentarios(false);
        }
    };

    const fetchPostagemDetails = async () => {
        setLoadingPostagem(true);
        try {
            const response = await fetch(`/api/v1/postagens/postagem/${id}`);
            const postagemData = await response.json();
            setPostagem(postagemData);
        } catch (error) {
            console.error("Erro ao carregar detalhes da postagem:", error);
        } finally {
            setLoadingPostagem(false);
        }
    };

    const criarComentario = async () => {
        if (!novoComentario.trim()) {
            setErroComentario("O comentário não pode estar vazio!");
            return;
        }

        setErroComentario("");

        setLoadingCriarComentario(true);
        try {
            const token = getToken(); // Obtém o token do authService
            if (!token) throw new Error("Usuário não autenticado");

            const response = await fetch("/api/v1/comentarios/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify({
                    postagemId: id,
                    usuarioId: 0,
                    texto: novoComentario,
                    parentId: null,
                }),
            });

            if (response.ok) {
                fetchComentariosByPostagem();
                setNovoComentario(""); // Limpa o campo de texto
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

    useEffect(() => {
        if (id) {
            fetchPostagemDetails();
            fetchComentariosByPostagem();
        }
    }, [id]);

    const isComentarioValido = novoComentario.trim().length > 0;

    return (
        <div className="nowuknow-comentarios-postagem">
            {loadingPostagem ? (
                <p>Carregando detalhes da postagem...</p>
            ) : postagem ? (
                <div className="nowuknow-comentarios-post-container">
                    <div className="nowuknow-post">
                        <h3 className="nowuknow-post-title">{postagem.postagem_titulo}</h3>
                        <p className="nowuknow-post-user">Por: {postagem.usuario_nome}</p>
                        <p className="nowuknow-post-date">Publicado em: {new Date(postagem.postagem_data_publicacao).toLocaleDateString("pt-BR")}</p>

                        {postagem.postagem_tipo === "Discussao" && postagem.discussao_texto && (
                            <p className="nowuknow-post-text">{postagem.discussao_texto}</p>
                        )}

                        {postagem.postagem_tipo === "Conteudo" && (
                            <>
                                {postagem.conteudo_tipo === "Video" ? (
                                    <div className="nowuknow-post-video-container">
                                        <video controls className="nowuknow-post-video-player">
                                            <source src={postagem.conteudo_url} type="video/mp4" />
                                            Seu navegador não suporta a reprodução de vídeo.
                                        </video>
                                    </div>
                                ) : postagem.conteudo_tipo === "Material_de_Aprendizado" ? (
                                    <a
                                        href={postagem.conteudo_url}
                                        download
                                        className="nowuknow-download-button"
                                    >
                                        Baixar Material
                                    </a>
                                ) : (
                                    <p>Tipo de conteúdo não suportado.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <p>Postagem não encontrada.</p>
            )}

            <h3 className="nowuknow-title-comentario">Comentários</h3>

            {isAuthenticated && (
                <div className="nowuknow-comentario-container">
                    <div className="nowuknow-comentario">

                        <h5 htmlFor="novoComentario" className="form-label">
                            Adicionar Comentário
                        </h5>
                        <textarea
                            id="novoComentario"
                            className="nowuknow-input"
                            placeholder="Escreva seu comentário aqui..."
                            value={novoComentario}
                            onChange={(e) => {
                                setNovoComentario(e.target.value);
                            }}
                            rows="3"
                        />
                        {erroComentario && <p className="erro-comentario">{erroComentario}</p>}
                        <br></br>
                        <br></br>
                        <button
                            className="nowuknow-btn"
                            onClick={criarComentario}
                            disabled={loadingCriarComentario || !isComentarioValido}
                        >
                            {loadingCriarComentario ? "Criando..." : "Comentar"}
                        </button>

                    </div>
                </div>
            )}


            {loadingComentarios ? (
                <p>Carregando comentários...</p>
            ) : comentarios.length > 0 ? (
                comentarios.map((comentario) => (

                    <div className="nowuknow-comentario-container">
                        <div className="nowuknow-comentario">
                            <h5 className="nowuknow-post-title">{comentario.usuario_nome}</h5>
                            <p className="nowuknow-post-text">{comentario.comentario_texto}</p>
                            <p className="nowuknow-post-date">Criado em: {new Date(comentario.comentario_data).toLocaleDateString("pt-BR")}</p>
                        </div>
                    </div>

                ))

            ) : (
                <p className="no-comentarios">Que tal ser o primeiro a deixar seu comentário?</p>
            )}

        </div>
    );
};

export default Postagem;
