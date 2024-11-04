const DiscussaoRepository = require('../service/serviceDiscussao.js');
const Discussao = require('../models/discussao.js');

const discussaoRepository = new DiscussaoRepository();

class DiscussaoController {
    validarPergunta(pergunta) {
        if (!pergunta) {
            return { isValid: false, message: "Preencha o campo de pergunta." };
        }
        if (pergunta.length < 10) {
            return { isValid: false, message: "A pergunta deve ter pelo menos 10 caracteres." };
        }
        return { isValid: true };
    }

    validarDados(discussao) {
        const validacaoPergunta = this.validarPergunta(discussao.pergunta);
        
        const errors = [];
        if (!validacaoPergunta.isValid) {
            errors.push({ campo: 'pergunta', mensagem: validacaoPergunta.message });
        }

        return { isValid: errors.length === 0, errors };
    }

    async criarDiscussao(usuarioId, conteudoId, pergunta) {
        const discussao = new Discussao(usuarioId, conteudoId, pergunta);
        const validacao = this.validarDados(discussao);

        if (!validacao.isValid) {
            return { sucesso: false, erros: validacao.errors };
        }
        const novaDiscussao = await discussaoRepository.createDiscussao(discussao);
        return { sucesso: true, discussao: novaDiscussao };
    }
    
    async listarDiscussoes() {
        const discussao = await discussaoRepository.getAllDiscussoes();
        return { sucesso: true, discussao };
    }

    async listarDiscussaoPorId(id) {
        const discussao = await discussaoRepository.getDiscussaoById(id);
        if (!discussao) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Discussão não encontrada." }] };
        }
        return { sucesso: true, discussao };
    }

    async atualizarDiscussao(id, usuarioId, conteudoId, pergunta) {
        const discussaoExistente = await discussaoRepository.getDiscussaoById(id);
        if (!discussaoExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Discussão não encontrada." }] };
        }

        const discussaoAtualizada = { id, usuarioId, conteudoId, pergunta };
        const validacao = this.validarDados(discussaoAtualizada);

        if (!validacao.isValid) {
            return { sucesso: false, erros: validacao.errors };
        }

        const resultadoAtualizacao = await discussaoRepository.updateDiscussao(discussaoAtualizada);
        return { sucesso: true, discussaoAtualizada: resultadoAtualizacao };
    }

    async deletarDiscussao(id) {
        const discussaoExistente = await discussaoRepository.getDiscussaoById(id);
        if (!discussaoExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Discussão não encontrada." }] };
        }
        await discussaoRepository.deleteDiscussao(id);
        return { sucesso: true, mensagem: "Discussão deletada com sucesso." };
    }
}

module.exports = DiscussaoController;
