const ConteudoRepository = require("../service/conteudoService.js");
const Conteudo = require("../entities/conteudo.js");
const conteudoRepository = new ConteudoRepository();

class ConteudoController {
  validarDados(conteudo) {
    const errors = [];

    if (!conteudo.postagem_id) {
      errors.push({
        campo: "postagem_id",
        mensagem: "O ID da postagem é obrigatório.",
      });
    }

    const tiposPermitidos = ["Video", "Material_de_Aprendizado"];
    if (
      !conteudo.tipo_conteudo ||
      !tiposPermitidos.includes(conteudo.tipo_conteudo)
    ) {
      errors.push({
        campo: "tipo_conteudo",
        mensagem: "Tipo de conteúdo inválido.",
      });
    }

    return { isValid: errors.length === 0, errors };
  }

  async criarConteudo(postagem_id, tipo_conteudo, arquivo, descricao) {
    console.log("Postagem_id ==", postagem_id);
    console.log("tipo_conteudo ==", tipo_conteudo);
    console.log("arquivo == ", arquivo);
    console.log("descricao == ", descricao);
    const conteudo = new Conteudo(
      0,
      postagem_id,
      tipo_conteudo,
      null,
      descricao || null,
      arquivo
    );
    const validacao = this.validarDados(conteudo);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }
    const novoConteudo = await conteudoRepository.createConteudo(conteudo);
    return { sucesso: true, conteudo: novoConteudo };
  }

  async listarConteudos() {
    const conteudos = await conteudoRepository.getAllConteudos();
    return { sucesso: true, conteudos };
  }

  async listarConteudoPorId(id) {
    const conteudo = await conteudoRepository.getConteudoById(id);
    if (!conteudo) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Conteúdo não encontrado." }],
      };
    }
    return { sucesso: true, conteudo };
  }

  async atualizarConteudo(id, postagem_id, tipo_conteudo, url, descricao) {
    const conteudoExistente = await conteudoRepository.getConteudoById(id);
    if (!conteudoExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Conteúdo não encontrado." }],
      };
    }

    const conteudoAtualizado = new Conteudo(
      id,
      postagem_id,
      tipo_conteudo,
      url,
      descricao || conteudoExistente.descricao
    );
    const validacao = this.validarDados(conteudoAtualizado);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    const resultadoAtualizacao = await conteudoRepository.updateConteudo(
      conteudoAtualizado
    );
    return { sucesso: true, conteudo: resultadoAtualizacao };
  }

  async deletarConteudo(id) {
    const conteudoExistente = await conteudoRepository.getConteudoById(id);
    if (!conteudoExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Conteúdo não encontrado." }],
      };
    }
    await conteudoRepository.deleteConteudo(id);
    return { sucesso: true, mensagem: "Conteúdo deletado com sucesso." };
  }

  async listarConteudosComAutor() {
    const conteudosComAutor = await conteudoRepository.getConteudosComAutor();
    return { sucesso: true, conteudos: conteudosComAutor };
  }
}

module.exports = ConteudoController;
