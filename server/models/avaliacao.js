class Avaliacao {
    constructor(usuarioId, conteudoId, nota, comentario) {
        this.usuario_id = usuarioId; 
        this.conteudo_id = conteudoId; 
        this.nota = nota; 
        this.comentario = comentario;
    }
}

module.exports = Avaliacao;