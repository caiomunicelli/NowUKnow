class Usuario {
    constructor(id, usuario, nome, email, senha, imagem = null, tipo = 'Basico', data_criacao = new Date()) {
        this.id = id;
        this.usuario = usuario;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.imagem = imagem;
        this.tipo = tipo;
        this.data_criacao = data_criacao;
    }
}

module.exports = Usuario;
