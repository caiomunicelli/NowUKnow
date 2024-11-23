const CategoriaRepository = require("../repositories/categoriaRepository.js");
const Categoria = require("../entities/categoria.js");

const categoriaRepository = new CategoriaRepository();

class CategoriaController {
  // Validar os dados da categoria
  validarDados(categoria) {
    const errors = [];

    if (!categoria.nome || categoria.nome.trim() === "") {
      errors.push({ campo: "nome", mensagem: "O nome é obrigatório." });
    }

    if (!categoria.descricao || categoria.descricao.trim() === "") {
      errors.push({
        campo: "descricao",
        mensagem: "A descrição é obrigatória.",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Criar uma nova categoria
  async criarCategoria(nome, descricao, imagem = null) {
    const categoria = new Categoria(0, nome, descricao, imagem);
    const validacao = this.validarDados(categoria);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    const categoriaCriada = await categoriaRepository.createCategoria(
      categoria
    );
    return { sucesso: true, categoria: categoriaCriada };
  }

  // Listar todas as categorias
  async listarCategorias() {
    const categorias = await categoriaRepository.getAllCategorias();
    return { sucesso: true, categorias };
  }

  // Buscar categoria por ID
  async listarCategoriaPorId(id) {
    const categoria = await categoriaRepository.getCategoriaById(id);
    if (!categoria) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Categoria não encontrada." }],
      };
    }
    return { sucesso: true, categoria };
  }

  // Buscar categoria por nome
  async listarCategoriaPorNome(nome) {
    const categorias = await categoriaRepository.getCategoriaByName(nome);
    if (categorias.length === 0) {
      return {
        sucesso: false,
        erros: [
          {
            campo: "nome",
            mensagem: "Nenhuma categoria encontrada com esse nome.",
          },
        ],
      };
    }
    return { sucesso: true, categorias };
  }

  // Atualizar uma categoria
  async atualizarCategoria(id, nome, descricao, imagem) {
    const categoriaExistente = await categoriaRepository.getCategoriaById(id);
    if (!categoriaExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Categoria não encontrada." }],
      };
    }

    const categoriaAtualizada = new Categoria(id, nome, descricao, imagem);
    const validacao = this.validarDados(categoriaAtualizada);

    if (!validacao.isValid) {
      return { sucesso: false, erros: validacao.errors };
    }

    const resultadoAtualizacao = await categoriaRepository.updateCategoria(
      categoriaAtualizada
    );
    return { sucesso: true, categoria: resultadoAtualizacao };
  }

  // Deletar uma categoria
  async deletarCategoria(id) {
    const categoriaExistente = await categoriaRepository.getCategoriaById(id);
    if (!categoriaExistente) {
      return {
        sucesso: false,
        erros: [{ campo: "id", mensagem: "Categoria não encontrada." }],
      };
    }
    await categoriaRepository.deleteCategoria(id);
    return { sucesso: true, mensagem: "Categoria deletada com sucesso." };
  }
}

module.exports = CategoriaController;
