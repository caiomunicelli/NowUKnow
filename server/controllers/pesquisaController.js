const UsuarioRepository = require("../repositories/usuarioRepository.js");
const PostagemRepository = require("../repositories/postagemRepository.js");
const CategoriaRepository = require("../repositories/categoriaRepository.js");
class PesquisaController {
  constructor() {
    this.usuarioRepository = new UsuarioRepository();
    this.postagemRepository = new PostagemRepository();
    this.categoriaRepository = new CategoriaRepository();
  }

  async realizarPesquisa(query, filter) {
    try {
        const filtrosPermitidos = {
            autor: "Usuarios",
            conteudo: "Postagem",
            categoria: "Categoria",
        };
        if (!filtrosPermitidos[filter]) {
            throw new Error("Filtro inválido.");
          }
        const tabela = filtrosPermitidos[filter];
         if(tabela == filtrosPermitidos.autor){
            const autores = await this.usuarioRepository.queryAutor(query);
            return { sucesso: true, dados: autores };
         }else if(tabela == filtrosPermitidos.conteudo){
            const conteudos = await this.postagemRepository.queryPostagem(query);
            return { sucesso: true, dados: conteudos };
         }else{
            const categorias = await this.categoriaRepository.queryCategoria(query);
            return { sucesso: true, dados: categorias };
        }
    } catch (erro) {
      return { sucesso: false, erros: [erro.message] };
    }
  }
}

module.exports = PesquisaController;
