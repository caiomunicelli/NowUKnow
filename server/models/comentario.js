class Comentario {
    constructor(id, postagemId, usuarioId, texto, parentId, dataComentario) {
        this.id = id;
        this.postagemId = postagemId;
        this.usuarioId = usuarioId;
        this.texto = texto;
        this.parentId = parentId;
        this.dataComentario = dataComentario;
    }
}

module.exports = Comentario;
