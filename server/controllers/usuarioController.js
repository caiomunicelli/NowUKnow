const UserRepository = require('../service/serviceUsuario.js');
const Usuario = require('../models/usuario.js');

const regex_num = /\d+/;
const regex_caractersespeciais = /[!@#$%^&*(),.?":{}|<>_\-+=\\\/\[\]`~;]/;
const regex_maiusculo = /[A-Z]/;
const regex_minusculo = /[a-z]/;
const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class UsuarioController {
    validarNome(nome) {
        if (!nome) {
            return { isValid: false, message: "Preencha o campo de nome." };
        }
        if (regex_num.test(nome) || regex_caractersespeciais.test(nome)) {
            return { isValid: false, message: "O nome não pode conter números ou caracteres especiais." };
        }
        const nomes = nome.split(" ");
        if (nomes.length < 2) {
            return { isValid: false, message: "O campo nome deve incluir o sobrenome." };
        }
        return { isValid: true };
    }

    validarSenha(senha) {
        if (!senha) {
            return { isValid: false, message: "Preencha o campo de senha." };
        }
        if (senha.length < 8 || !regex_num.test(senha) || !regex_maiusculo.test(senha) || 
            !regex_caractersespeciais.test(senha) || !regex_minusculo.test(senha)) {
            return {
                isValid: false,
                message: "A senha deve incluir ao menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caracter especial."
            };
        }
        return { isValid: true };
    }

    validarEmail(email) {
        if (!email) {
            return { isValid: false, message: "Preencha o campo de email." };
        }
        if (!regex_email.test(email)) {
            return { isValid: false, message: "Você deve inserir um email válido." };
        }
        return { isValid: true };
    }

    validarDados(usuario) {
        const validacoes = {
            nome: this.validarNome(usuario.nome),
            senha: this.validarSenha(usuario.senha),
            email: this.validarEmail(usuario.email)
        };

        const errors = Object.keys(validacoes)
            .filter((key) => !validacoes[key].isValid)
            .map((key) => ({ campo: key, mensagem: validacoes[key].message }));

        return { isValid: errors.length === 0, errors };
    }

    async criarUsuario(nome, email, senha, tipo) {
        const usuario = new Usuario(nome, email, senha, tipo);
        const validacao = this.validarDados(usuario);

        if (!validacao.isValid) {
            return { sucesso: false, erros: validacao.errors };
        }
        const novoUsuario = await UserRepository.createUser(usuario);
        return { sucesso: true, usuario: novoUsuario };
    }
    
    async listarUsuarios() {
        const usuarios = await UserRepository.getAllUsers();
        return { sucesso: true, usuarios };
    }

    async listarUsuarioPorId(id) {
        const usuario = await UserRepository.getUserById(id);
        if (!usuario) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Usuário não encontrado." }] };
        }
        return { sucesso: true, usuario };
    }

    async atualizarUsuario(id, nome, email, senha, tipo) {
        const usuarioExistente = await UserRepository.getUserById(id);
        if (!usuarioExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Usuário não encontrado." }] };
        }

        const usuarioAtualizado = { nome, email, senha, tipo };
        const validacao = this.validarDados(usuarioAtualizado);

        if (!validacao.isValid) {
            return { sucesso: false, erros: validacao.errors };
        }

        const resultadoAtualizacao = await UserRepository.updateUser(usuarioAtualizado);
        return { sucesso: true, usuarioAtualizado: resultadoAtualizacao };
    }

    async deletarUsuario(id) {
        const usuarioExistente = await UserRepository.getUserById(id);
        if (!usuarioExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Usuário não encontrado." }] };
        }
        await UserRepository.deleteUser(id);
        return { sucesso: true, mensagem: "Usuário deletado com sucesso." };
    }
}

module.exports = UsuarioController;
