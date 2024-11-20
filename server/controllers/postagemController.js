const PostagemRepository = require("../repositories/postagemRepository.js");
const Postagem = require("../entities/postagem.js");

class PostagemController {
  constructor() {
    this.postagemRepository = new PostagemRepository();
  }

  // Validar os dados da postagem
  validarDados(postagem) {
    const errors = [];

    if (!postagem.titulo || postagem.titulo.trim() === "") {
      errors.push({ campo: "titulo", mensagem: "O título é obrigatório." });
    }

    if (!postagem.tipoPostagem || postagem.tipoPostagem.trim() === "") {
      errors.push({
        campo: "tipoPostagem",
        mensagem: "O tipo de postagem é obrigatório.",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Criar uma nova postagem
  async criarPostagem(
    titulo,
    tipoPostagem,
    autorId,
    categoriaId,
    certificacaoId
  ) {
    const postagem = new Postagem(
      0,
      titulo,
      tipoPostagem,
      autorId,
      categoriaId,
      certificacaoId
    );
    const validacao = this.validarDados(postagem);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    const postagemCriada = await this.postagemRepository.createPostagem(
      postagem
    );
    return { sucesso: true, postagem: postagemCriada };
  }

  // Listar todas as postagens
  async listarPostagens() {
    const postagens = await this.postagemRepository.getAllPostagens();
    return { sucesso: true, postagens };
  }
  async listarPostagensComDetalhes() {
    const postagens =
      await this.postagemRepository.getPostagensWithAllDetails();
    return { sucesso: true, postagens };
  }
  async listarPostagensComDetalhesPorCategoriaId(categoriaId) {
    const postagens =
      await this.postagemRepository.getPostagensWithAllDetailsByCategoriaId(
        categoriaId
      );
    return { sucesso: true, postagens };
  }
  async listarPostagensComDetalhesPorAutorId(autorId) {
    const postagens =
      await this.postagemRepository.getPostagensWithAllDetailsByAutorId(
        autorId
      );
    return { sucesso: true, postagens };
  }

  // Buscar postagem por ID
  async listarPostagemPorId(id) {
    const postagem = await this.postagemRepository.getPostagemById(id);
    if (!postagem) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Postagem não encontrada." }],
      };
    }
    return { sucesso: true, postagem };
  }

  // Buscar postagens por título
  async listarPostagemPorTitulo(titulo) {
    if (!titulo || titulo.trim() === "") {
      return {
        sucesso: false,
        erros: [
          { campo: "titulo", mensagem: "O título é obrigatório para a busca." },
        ],
      };
    }

    const postagens = await this.postagemRepository.getPostagemByTitulo(titulo);
    if (postagens.length === 0) {
      return {
        sucesso: false,
        erros: [
          {
            campo: "titulo",
            mensagem: "Nenhuma postagem encontrada com esse título.",
          },
        ],
      };
    }

    return { sucesso: true, postagens };
  }

  // Buscar postagens por categoriaId
  async listarPostagemPorCategoria(categoriaId) {
    if (!categoriaId) {
      return {
        sucesso: false,
        erros: [
          {
            campo: "categoriaId",
            mensagem: "O ID da categoria é obrigatório para a busca.",
          },
        ],
      };
    }

    const postagens = await this.postagemRepository.getPostagemByCategoria(
      categoriaId
    );
    if (postagens.length === 0) {
      return {
        sucesso: false,
        erros: [
          {
            campo: "categoriaId",
            mensagem: "Nenhuma postagem encontrada com essa categoria.",
          },
        ],
      };
    }

    return { sucesso: true, postagens };
  }

  // Buscar postagens por autorId
  async listarPostagemPorAutor(autorId) {
    if (!autorId) {
      return {
        sucesso: false,
        erros: [
          {
            campo: "autorId",
            mensagem: "O ID do autor é obrigatório para a busca.",
          },
        ],
      };
    }

    const postagens = await this.postagemRepository.getPostagemByAutorId(
      autorId
    );
    if (postagens.length === 0) {
      return {
        sucesso: false,
        erros: [
          {
            campo: "autorId",
            mensagem: "Nenhuma postagem encontrada com esse autor.",
          },
        ],
      };
    }

    return { sucesso: true, postagens };
  }

  // Buscar postagens por certificacaoId
  async listarPostagemPorCertificacao(certificacaoId) {
    if (!certificacaoId) {
      return {
        sucesso: false,
        erros: [
          {
            campo: "certificacaoId",
            mensagem: "O ID da certificação é obrigatório para a busca.",
          },
        ],
      };
    }

    const postagens = await this.postagemRepository.getPostagemByCertificacaoId(
      certificacaoId
    );
    if (postagens.length === 0) {
      return {
        sucesso: false,
        erros: [
          {
            campo: "certificacaoId",
            mensagem: "Nenhuma postagem encontrada com essa certificação.",
          },
        ],
      };
    }

    return { sucesso: true, postagens };
  }

  // Atualizar uma postagem
  async atualizarPostagem(
    id,
    titulo,
    tipoPostagem,
    autorId,
    categoriaId,
    certificacaoId
  ) {
    const postagemExistente = await this.postagemRepository.getPostagemById(id);
    if (!postagemExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Postagem não encontrada." }],
      };
    }

    const postagemAtualizada = new Postagem(
      id,
      titulo,
      tipoPostagem,
      autorId,
      categoriaId,
      certificacaoId
    );
    const validacao = this.validarDados(postagemAtualizada);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    const resultadoAtualizacao = await this.postagemRepository.updatePostagem(
      postagemAtualizada
    );
    return { sucesso: true, postagem: resultadoAtualizacao };
  }

  // Deletar uma postagem
  async deletarPostagem(id) {
    const postagemExistente = await this.postagemRepository.getPostagemById(id);
    if (!postagemExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Postagem não encontrada." }],
      };
    }
    await this.postagemRepository.deletePostagem(id);
    return { sucesso: true, mensagem: "Postagem deletada com sucesso." };
  }
}

module.exports = PostagemController;
