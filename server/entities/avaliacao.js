class Avaliacao {
    constructor(id, usuarioId, postagemId, nota, comentario, dataAvaliacao) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.postagemId = postagemId;
        this.nota = nota;
        this.comentario = comentario || null;
        this.dataAvaliacao = dataAvaliacao || new Date();
    }
}

module.exports = Avaliacao;
