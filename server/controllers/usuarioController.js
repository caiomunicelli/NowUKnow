const UserRepository = require("../repositories/usuarioRepository.js");
const Usuario = require("../entities/usuario.js");

const regex_num = /\d+/;
const regex_caractersespeciais = /[!@#$%^&*(),.?":{}|<>_\-+=\\\/\[\]`~;]/;
const regex_maiusculo = /[A-Z]/;
const regex_minusculo = /[a-z]/;
const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userRepository = new UserRepository();

class UsuarioController {
  validarNome(nome) {
    if (!nome) {
      return { isValid: false, message: "Preencha o campo de nome." };
    }
    if (regex_num.test(nome) || regex_caractersespeciais.test(nome)) {
      return {
        isValid: false,
        message: "O nome não pode conter números ou caracteres especiais.",
      };
    }
    const nomes = nome.split(" ");
    if (nomes.length < 2) {
      return {
        isValid: false,
        message: "O campo nome deve incluir o sobrenome.",
      };
    }
    return { isValid: true };
  }

  validarSenha(senha) {
    if (!senha) {
      return { isValid: false, message: "Preencha o campo de senha." };
    }
    if (
      senha.length < 8 ||
      !regex_num.test(senha) ||
      !regex_maiusculo.test(senha) ||
      !regex_caractersespeciais.test(senha) ||
      !regex_minusculo.test(senha)
    ) {
      return {
        isValid: false,
        message:
          "A senha deve incluir ao menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caracter especial.",
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
      email: this.validarEmail(usuario.email),
    };

    const errors = Object.keys(validacoes)
      .filter((key) => !validacoes[key].isValid)
      .map((key) => ({ campo: key, mensagem: validacoes[key].message }));

    return { isValid: errors.length === 0, errors };
  }

  async criarUsuario(usuario, nome, email, senha, tipo, imagem = null) {
    const novoUsuario = new Usuario(
      0,
      usuario,
      nome,
      email,
      senha,
      imagem,
      tipo
    );
    const validacao = this.validarDados(novoUsuario);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    const usuarioCriado = await userRepository.createUser(novoUsuario);
    return { sucesso: true, usuario: usuarioCriado };
  }

  async listarUsuarios() {
    const usuarios = await userRepository.getAllUsers();
    return { sucesso: true, usuarios };
  }

  async listarUsuarioPorEmail(email) {
    const usuario = await userRepository.getUserByEmail(email);
    if (!usuario) {
      return {
        sucesso: false,
        erros: [{ campo: "email", mensagem: "Usuário não encontrado." }],
      };
    }
    return { sucesso: true, usuario };
  }

  async listarUsuarioPorId(id) {
    const usuario = await userRepository.getUserById(id);
    if (!usuario) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Usuário não encontrado." }],
      };
    }
    return { sucesso: true, usuario };
  }

  async atualizarUsuario(id, usuario, nome, email, senha, tipo, imagem = null) {
    const usuarioExistente = await userRepository.getUserById(id);
    if (!usuarioExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Usuário não encontrado." }],
      };
    }

    const usuarioAtualizado = new Usuario(
      id,
      usuario,
      nome,
      email,
      senha,
      imagem,
      tipo
    );
    const validacao = this.validarDados(usuarioAtualizado);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    const resultadoAtualizacao = await userRepository.updateUser(
      usuarioAtualizado
    );
    return { sucesso: true, usuario: resultadoAtualizacao };
  }

  async deletarUsuario(id) {
    const usuarioExistente = await userRepository.getUserById(id);
    if (!usuarioExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Usuário não encontrado." }],
      };
    }
    await userRepository.deleteUser(id);
    return { sucesso: true, mensagem: "Usuário deletado com sucesso." };
  }
}

module.exports = UsuarioController;
