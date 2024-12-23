const DiscussaoRepository = require("../repositories/discussaoRepository.js");
const Discussao = require("../entities/discussao.js");

const discussaoRepository = new DiscussaoRepository();

class DiscussaoController {
  async criarDiscussao(postagem_id, tipo_discussao, texto) {
    const discussao = new Discussao(0, postagem_id, tipo_discussao, texto);
    const novaDiscussao = await discussaoRepository.createDiscussao(discussao);
    return { sucesso: true, discussao: novaDiscussao };
  }

  async listarDiscussoes() {
    const discussoes = await discussaoRepository.getAllDiscussoes();
    return { sucesso: true, discussoes };
  }

  async listarDiscussaoPorId(id) {
    const discussao = await discussaoRepository.getDiscussaoById(id);
    if (!discussao) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Discussão não encontrada." }],
      };
    }
    return { sucesso: true, discussao };
  }

  async listarDiscussaoPorPostagemId(postagem_id) {
    const discussao = await discussaoRepository.getDiscussaoByPostagemId(
      postagem_id
    );
    if (!discussao) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Discussão não encontrada." }],
      };
    }
    return { sucesso: true, discussao };
  }
  async atualizarDiscussao(id, postagem_id, tipo_discussao, texto) {
    const discussaoExistente = await discussaoRepository.getDiscussaoById(id);
    if (!discussaoExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Discussão não encontrada." }],
      };
    }
    if (postagem_id != discussaoExistente.postagem_id) {
      return {
        sucesso: false,
        erros: [
          { campo: "postagem_id", mensagem: "Id da Postagem diferente." },
        ],
      };
    }
    const discussaoAtualizada = new Discussao(
      id,
      postagem_id,
      tipo_discussao,
      texto || discussaoExistente.texto
    );
    const resultadoAtualizacao = await discussaoRepository.updateDiscussao(
      discussaoAtualizada
    );
    return { sucesso: true, mensagem: resultadoAtualizacao };
  }

  async deletarDiscussao(id) {
    const discussaoExistente = await discussaoRepository.getDiscussaoById(id);
    if (!discussaoExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Discussão não encontrada." }],
      };
    }
    await discussaoRepository.deleteDiscussao(id);
    return { sucesso: true, mensagem: "Discussão deletada com sucesso." };
  }
}

module.exports = DiscussaoController;
