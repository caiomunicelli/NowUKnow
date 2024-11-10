class Conteudo {
    constructor(id, postagem_id, tipo_conteudo, url, descricao) {
        this.id = id;
        this.postagem_id = postagem_id;
        this.tipo_conteudo = tipo_conteudo;
        this.url = url;
        this.descricao = descricao || null; // Descrição é opcional
    }
}

module.exports = Conteudo;
