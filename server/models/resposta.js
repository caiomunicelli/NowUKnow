class Resposta {
    constructor(usuarioId, discussaoId, resposta) {
        this.usuario_id = usuarioId; 
        this.discussao_id = discussaoId; 
        this.resposta = resposta;
    }
}

module.exports = Resposta;
