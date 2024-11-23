import React, { useState } from "react";
import { criarCategoria } from "../../services/categoriaService";
import { useNavigate } from "react-router-dom";
import "./CreateCategoria.css";

function CreateCategoria({ onCategoriaCriada }) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [foto, setFoto] = useState(null);
    const [previewFoto, setPreviewFoto] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleNomeChange = (e) => setNome(e.target.value);
    const handleDescricaoChange = (e) => setDescricao(e.target.value);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        setFoto(file);
        setPreviewFoto(URL.createObjectURL(file));
    };

    const handleLimparFoto = () => {
        setFoto(null);
        setPreviewFoto(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {

            if (!nome || !descricao) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }

            const formData = new FormData();
            formData.append("nome", nome);
            formData.append("descricao", descricao);
            if (foto) {
                formData.append("foto", foto);
            }

            const novaCategoria = await criarCategoria(formData);
            if (onCategoriaCriada) {
                onCategoriaCriada(novaCategoria);
            }

            if (novaCategoria) {
                setNome("");
                setDescricao("");
                setFoto(null);
                setPreviewFoto(null);
                setError("");
                navigate("/categorias");
            } else {
                console.error("Erro ao criar categoria.");
            }

        } catch (error) {
            setError(
                error.response?.data?.mensagem || "Erro ao criar categoria. Tente novamente."
            );
        }
    };

    return (
        <div className="nowuknow-box-container">
            <h2>Criar Categoria</h2>
            <form onSubmit={handleSubmit} className="nowuknow-form-container">
                <div className="mb-3">
                    <label htmlFor="nome" className="form-label">
                        Nome:
                    </label>
                    <input
                        type="text"
                        id="nome"
                        className="nowuknow-input"
                        value={nome}
                        onChange={handleNomeChange}
                        placeholder="Digite o nome da categoria"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="descricao" className="form-label">
                        Descrição:
                    </label>
                    <textarea
                        id="descricao"
                        className="nowuknow-input"
                        value={descricao}
                        onChange={handleDescricaoChange}
                        placeholder="Digite a descrição da categoria"
                        rows="3"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="foto" className="form-label">
                        Imagem:
                    </label>

                    <input
                        type="file"
                        id="foto"
                        className="nowuknow-input"
                        onChange={handleFotoChange}
                        accept="image/png, image/jpeg, image/jpg"
                    />
                    <br></br>
                    {previewFoto && (
                        <div className="nowuknow-foto-preview">
                            <img src={previewFoto} alt="Preview" />
                            <button
                                type="button"
                                className="nowuknow-btn-clear"
                                onClick={handleLimparFoto}
                            >
                                Limpar Foto
                            </button>
                        </div>
                    )}
                </div>
                <br></br>
                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="nowuknow-button">
                    Criar Categoria
                </button>
            </form>
        </div>
    );
}

export default CreateCategoria;