class Postagem {
    constructor(id, titulo, tipoPostagem, autorId, categoriaId, certificacaoId, dataPublicacao) {
        this.id = id;
        this.titulo = titulo;
        this.tipoPostagem = tipoPostagem;
        this.autorId = autorId;
        this.categoriaId = categoriaId;
        this.certificacaoId = certificacaoId;
        this.dataPublicacao = dataPublicacao;
    }
}

module.exports = Postagem;
