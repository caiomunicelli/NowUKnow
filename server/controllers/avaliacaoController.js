const Avaliacao = require("../entities/avaliacao.js");
const AvaliacaoRepository = require("../repositories/avaliacaoRepository.js");

const avaliacaoRepository = new AvaliacaoRepository();

class AvaliacaoController {
  // Validar os dados de uma avaliação
  validarDados(avaliacao) {
    const errors = [];

    if (!avaliacao.usuarioId) {
      errors.push({
        campo: "usuarioId",
        mensagem: "O ID do usuário é obrigatório.",
      });
    }

    if (!avaliacao.postagemId) {
      errors.push({
        campo: "postagemId",
        mensagem: "O ID da postagem é obrigatório.",
      });
    }

    if (!avaliacao.nota || avaliacao.nota < 1 || avaliacao.nota > 5) {
      errors.push({ campo: "nota", mensagem: "A nota deve ser entre 1 e 5." });
    }

    return { isValid: errors.length === 0, errors };
  }

  // Criar uma avaliação
  async criarAvaliacao(usuarioId, postagemId, nota, comentario) {
    const avaliacao = new Avaliacao(0, usuarioId, postagemId, nota, comentario);
    const validacao = this.validarDados(avaliacao);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    try {
      const novaAvaliacao = await avaliacaoRepository.createAvaliacao(
        avaliacao
      );
      return { sucesso: true, avaliacao: novaAvaliacao };
    } catch (error) {
      throw new Error("Erro ao criar avaliação: " + error.message);
    }
  }

  // Listar todas as avaliações
  async listarAvaliacoes() {
    try {
      const avaliacoes = await avaliacaoRepository.getAllAvaliacoes();
      return { sucesso: true, avaliacoes };
    } catch (error) {
      throw new Error("Erro ao buscar avaliações: " + error.message);
    }
  }

  // Listar avaliação por ID
  async listarAvaliacaoPorId(id) {
    try {
      const avaliacao = await avaliacaoRepository.getAvaliacaoById(id);
      if (!avaliacao) {
        return {
          sucesso: false,
          erros: [{ campo: "id", mensagem: "Avaliação não encontrada." }],
        };
      }
      return { sucesso: true, avaliacao };
    } catch (error) {
      throw new Error("Erro ao buscar avaliação: " + error.message);
    }
  }

  // Atualizar avaliação
  async atualizarAvaliacao(id, nota, comentario) {
    const avaliacaoExistente = await avaliacaoRepository.getAvaliacaoById(id);
    if (!avaliacaoExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Avaliação não encontrada." }],
      };
    }

    const avaliacaoAtualizada = new Avaliacao(
      id,
      avaliacaoExistente.usuarioId,
      avaliacaoExistente.postagemId,
      nota || avaliacaoExistente.nota,
      comentario || avaliacaoExistente.comentario
    );
    const validacao = this.validarDados(avaliacaoAtualizada);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    try {
      const resultadoAtualizacao = await avaliacaoRepository.updateAvaliacao(
        avaliacaoAtualizada
      );
      return { sucesso: true, avaliacao: resultadoAtualizacao };
    } catch (error) {
      throw new Error("Erro ao atualizar avaliação: " + error.message);
    }
  }

  // Deletar avaliação
  async deletarAvaliacao(id) {
    const avaliacaoExistente = await avaliacaoRepository.getAvaliacaoById(id);
    if (!avaliacaoExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Avaliação não encontrada." }],
      };
    }

    try {
      await avaliacaoRepository.deleteAvaliacao(id);
      return { sucesso: true, mensagem: "Avaliação deletada com sucesso." };
    } catch (error) {
      throw new Error("Erro ao deletar avaliação: " + error.message);
    }
  }

  // Listar avaliações de uma postagem
  async listarAvaliacoesPorPostagem(postagemId) {
    try {
      const avaliacoes = await avaliacaoRepository.getAvaliacoesPorPostagem(
        postagemId
      );
      return { sucesso: true, avaliacoes };
    } catch (error) {
      throw new Error(
        "Erro ao buscar avaliações da postagem: " + error.message
      );
    }
  }
}

module.exports = AvaliacaoController;
