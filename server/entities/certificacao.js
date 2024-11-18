class Certificacao {
    constructor(id, nome, descricao, requisitos, imagem, categoriaId, nivel, dataCriacao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.requisitos = requisitos;
        this.imagem = imagem;
        this.categoriaId = categoriaId;
        this.nivel = nivel;
        this.dataCriacao = dataCriacao;
    }
}

module.exports = Certificacao;
