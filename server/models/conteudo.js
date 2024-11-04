class Conteudo {
    constructor(id, titulo, descricao, tipo_conteudo, autor_id, data_upload, nivel_dificuldade, duracao, categoria) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.tipo_conteudo = tipo_conteudo;
        this.autor_id = autor_id;
        this.data_upload = data_upload;
        this.nivel_dificuldade = nivel_dificuldade;
        this.duracao = duracao;
        this.categoria = categoria;
    }
}

module.exports = Conteudo;