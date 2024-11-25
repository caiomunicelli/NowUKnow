class Avaliacao {
    constructor(id, usuarioId, postagemId, feedback, dataAvaliacao) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.postagemId = postagemId;
        this.feedback = feedback; // Deve ser 'positivo' ou 'negativo'
        this.dataAvaliacao = dataAvaliacao || new Date();
    }
}

module.exports = Avaliacao;