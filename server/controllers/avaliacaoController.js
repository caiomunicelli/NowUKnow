const AvaliacaoRepository = require('../service/avaliacaoService.js');
const Avaliacao = require('../models/avaliacao.js');

const regex_nota = /^[1-5]$/;

const avaliacaoRepository = new AvaliacaoRepository();

class AvaliacaoController {
    validarNota(nota) {
        if (!nota) {
            return { isValid: false, message: "Preencha o campo de nota." };
        }
        if (!regex_nota.test(nota)) {
            return { isValid: false, message: "A nota deve ser um número entre 1 e 5." };
        }
        return { isValid: true };
    }

    validarComentario(comentario) {
        if (comentario && comentario.length > 500) {
            return { isValid: false, message: "O comentário não pode ter mais de 500 caracteres." };
        }
        return { isValid: true };
    }

    validarDados(avaliacao) {
        const validacoes = {
            nota: this.validarNota(avaliacao.nota),
            comentario: this.validarComentario(avaliacao.comentario)
        };

        const errors = Object.keys(validacoes)
            .filter((key) => !validacoes[key].isValid)
            .map((key) => ({ campo: key, mensagem: validacoes[key].message }));

        return { isValid: errors.length === 0, errors };
    }

    async criarAvaliacao(usuario_id, conteudo_id, nota, comentario) {
        const avaliacao = new Avaliacao(usuario_id, conteudo_id, nota, comentario);
        const validacao = this.validarDados(avaliacao);

        if (!validacao.isValid) {
            return { sucesso: false, erros: validacao.errors };
        }

        const novaAvaliacao = await avaliacaoRepository.createAvaliacao(avaliacao);
        return { sucesso: true, avaliacao: novaAvaliacao };
    }

    async listarAvaliacoes() {
        const avaliacoes = await avaliacaoRepository.getAllAvaliacoes();
        return { sucesso: true, avaliacoes };
    }

    async listarAvaliacaoPorId(id) {
        const avaliacao = await avaliacaoRepository.getAvaliacaoById(id);
        if (!avaliacao) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Avaliação não encontrada." }] };
        }
        return { sucesso: true, avaliacao };
    }

    async atualizarAvaliacao(id, usuario_id, conteudo_id, nota, comentario) {
        const avaliacaoExistente = await avaliacaoRepository.getAvaliacaoById(id);
        if (!avaliacaoExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Avaliação não encontrada." }] };
        }

        const avaliacaoAtualizada = { id, usuario_id, conteudo_id, nota, comentario };
        const validacao = this.validarDados(avaliacaoAtualizada);

        if (!validacao.isValid) {
            return { sucesso: false, erros: validacao.errors };
        }

        const resultadoAtualizacao = await avaliacaoRepository.updateAvaliacao(avaliacaoAtualizada);
        return { sucesso: true, avaliacaoAtualizada: resultadoAtualizacao };
    }

    async deletarAvaliacao(id) {
        const avaliacaoExistente = await avaliacaoRepository.getAvaliacaoById(id);
        if (!avaliacaoExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Avaliação não encontrada." }] };
        }
        await avaliacaoRepository.deleteAvaliacao(id);
        return { sucesso: true, mensagem: "Avaliação deletada com sucesso." };
    }
}

module.exports = AvaliacaoController;
