const PostagemRepository = require('../service/postagemService.js');
const Postagem = require('../models/postagem.js');

const postagensRepository = new PostagemRepository();

class PostagemController {
    // Validações para os dados da postagem
    validarDados(postagem) {
        const errors = [];

        if (!postagem.titulo || postagem.titulo.length === 0) {
            errors.push({ campo: 'titulo', mensagem: "O título é obrigatório." });
        }

        const tiposPermitidos = ['Conteudo', 'Discussao'];
        if (!postagem.tipoPostagem || !tiposPermitidos.includes(postagem.tipoPostagem)) {
            errors.push({ campo: 'tipoPostagem', mensagem: "Tipo de postagem inválido." });
        }

        if (!postagem.autorId) {
            errors.push({ campo: 'autorId', mensagem: "O ID do autor é obrigatório." });
        }

        if (!postagem.categoriaId) {
            errors.push({ campo: 'categoriaId', mensagem: "O ID da categoria é obrigatório." });
        }

        return { isValid: errors.length === 0, errors };
    }

    // Criar postagem
    async criarPostagem(titulo, tipoPostagem, autorId, categoriaId, certificacaoId) {
        const postagem = new Postagem(0, titulo, tipoPostagem, autorId, categoriaId, certificacaoId, new Date());
        const validacao = this.validarDados(postagem);

        if (!validacao.isValid) {
            return { sucesso: false, erros: validacao.errors };
        }

        try {
            const novaPostagem = await postagensRepository.createPostagem(postagem);
            return { sucesso: true, postagem: novaPostagem };
        } catch (error) {
            throw new Error('Erro ao criar postagem: ' + error.message);
        }
    }

    // Listar todas as postagens
    async listarPostagens() {
        try {
            const postagens = await postagensRepository.getAllPostagens();
            return { sucesso: true, postagens };
        } catch (error) {
            throw new Error('Erro ao buscar postagens: ' + error.message);
        }
    }

    // Listar postagem por ID
    async listarPostagemPorId(id) {
        try {
            const postagem = await postagensRepository.getPostagemById(id);
            if (!postagem) {
                return { sucesso: false, erros: [{ campo: 'id', mensagem: "Postagem não encontrada." }] };
            }
            return { sucesso: true, postagem };
        } catch (error) {
            throw new Error('Erro ao buscar postagem: ' + error.message);
        }
    }

    // Atualizar postagem
    async atualizarPostagem(id, titulo, tipoPostagem, autorId, categoriaId, certificacaoId) {
        const postagemExistente = await postagensRepository.getPostagemById(id);
        if (!postagemExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Postagem não encontrada." }] };
        }

        const postagemAtualizada = new Postagem(id, titulo, tipoPostagem, autorId, categoriaId, certificacaoId, postagemExistente.dataPublicacao);
        const validacao = this.validarDados(postagemAtualizada);

        if (!validacao.isValid) {
            return { sucesso: false, erros: validacao.errors };
        }

        try {
            const resultadoAtualizacao = await postagensRepository.updatePostagem(postagemAtualizada);
            return { sucesso: true, postagem: resultadoAtualizacao };
        } catch (error) {
            throw new Error('Erro ao atualizar postagem: ' + error.message);
        }
    }

    // Deletar postagem
    async deletarPostagem(id) {
        const postagemExistente = await postagensRepository.getPostagemById(id);
        if (!postagemExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Postagem não encontrada." }] };
        }

        try {
            await postagensRepository.deletePostagem(id);
            return { sucesso: true, mensagem: "Postagem deletada com sucesso." };
        } catch (error) {
            throw new Error('Erro ao deletar postagem: ' + error.message);
        }
    }
}

module.exports = PostagemController;
