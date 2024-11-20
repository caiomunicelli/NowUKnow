const ComentarioRepository = require("../repositories/comentarioRepository.js");
const Comentario = require("../entities/comentario.js");

const comentarioRepository = new ComentarioRepository();

class ComentarioController {
  // Validar os dados de um comentário
  validarDados(comentario) {
    const errors = [];

    if (!comentario.postagemId) {
      errors.push({
        campo: "postagemId",
        mensagem: "O ID da postagem é obrigatório.",
      });
    }

    if (!comentario.usuarioId) {
      errors.push({
        campo: "usuarioId",
        mensagem: "O ID do usuário é obrigatório.",
      });
    }

    if (!comentario.texto || comentario.texto.length === 0) {
      errors.push({
        campo: "texto",
        mensagem: "O texto do comentário é obrigatório.",
      });
    }

    return { isValid: errors.length === 0, errors };
  }

  // Criar um comentário
  async criarComentario(postagemId, usuarioId, texto, parentId) {
    const comentario = new Comentario(
      0,
      postagemId,
      usuarioId,
      texto,
      parentId
    );
    const validacao = this.validarDados(comentario);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    try {
      const novoComentario = await comentarioRepository.createComentario(
        comentario
      );
      return { sucesso: true, comentario: novoComentario };
    } catch (error) {
      throw new Error("Erro ao criar comentário: " + error.message);
    }
  }

  // Listar todos os comentários
  async listarComentarios() {
    try {
      const comentarios = await comentarioRepository.getAllComentarios();
      return { sucesso: true, comentarios };
    } catch (error) {
      throw new Error("Erro ao buscar comentários: " + error.message);
    }
  }

  // Listar comentário por ID
  async listarComentarioPorId(id) {
    try {
      const comentario = await comentarioRepository.getComentarioById(id);
      if (!comentario) {
        return {
          sucesso: false,
          erros: [{ campo: "id", mensagem: "Comentário não encontrado." }],
        };
      }
      return { sucesso: true, comentario };
    } catch (error) {
      throw new Error("Erro ao buscar comentário: " + error.message);
    }
  }

  // Atualizar comentário
  async atualizarComentario(id, texto) {
    const comentarioExistente = await comentarioRepository.getComentarioById(
      id
    );
    if (!comentarioExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Comentário não encontrado." }],
      };
    }

    const comentarioAtualizado = new Comentario(
      id,
      comentarioExistente.postagemId,
      comentarioExistente.usuarioId,
      texto || comentarioExistente.texto,
      comentarioExistente.parentId
    );
    const validacao = this.validarDados(comentarioAtualizado);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    try {
      const resultadoAtualizacao = await comentarioRepository.updateComentario(
        comentarioAtualizado
      );
      return { sucesso: true, comentario: resultadoAtualizacao };
    } catch (error) {
      throw new Error("Erro ao atualizar comentário: " + error.message);
    }
  }

  // Deletar comentário
  async deletarComentario(id) {
    const comentarioExistente = await comentarioRepository.getComentarioById(
      id
    );
    if (!comentarioExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Comentário não encontrado." }],
      };
    }

    try {
      await comentarioRepository.deleteComentario(id);
      return { sucesso: true, mensagem: "Comentário deletado com sucesso." };
    } catch (error) {
      throw new Error("Erro ao deletar comentário: " + error.message);
    }
  }

  // Listar comentários de uma postagem
  async listarComentariosPorPostagem(postagemId) {
    try {
      const comentarios = await comentarioRepository.getComentariosPorPostagem(
        postagemId
      );
      return { sucesso: true, comentarios };
    } catch (error) {
      throw new Error(
        "Erro ao buscar comentários da postagem: " + error.message
      );
    }
  }
}

module.exports = ComentarioController;
