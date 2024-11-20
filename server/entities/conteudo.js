class Conteudo {
  constructor(id, postagem_id, tipo_conteudo, url, descricao, arquivo = null) {
    this.id = id;
    this.postagem_id = postagem_id;
    this.tipo_conteudo = tipo_conteudo;
    this.url = url || null;
    this.descricao = descricao || null;
    if (arquivo) {
      this.arquivo = arquivo;
    } // Descrição é opcional
  }
}

module.exports = Conteudo;
