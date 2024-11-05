const RespostaRepository = require('../service/respostaService.js');
const Resposta = require('../models/resposta.js');

const respostaRepository = new RespostaRepository();

class RespostaController {
    async criarResposta(usuario_id, discussao_id, resposta) {
        const novaResposta = new Resposta(usuario_id, discussao_id, resposta);
        
        if (!resposta) {
            return { sucesso: false, erros: [{ campo: 'resposta', mensagem: "O campo resposta não pode estar vazio." }] };
        }

        const respostaCriada = await respostaRepository.createResposta(novaResposta);
        return { sucesso: true, resposta: respostaCriada };
    }

    async listarRespostas() {
        const respostas = await respostaRepository.getAllRespostas();
        return { sucesso: true, respostas };
    }

    async listarRespostaPorId(id) {
        const resposta = await respostaRepository.getRespostaById(id);
        if (!resposta) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Resposta não encontrada." }] };
        }
        return { sucesso: true, resposta };
    }

    async atualizarResposta(id, usuario_id, discussao_id, resposta) {
        const respostaExistente = await respostaRepository.getRespostaById(id);
        if (!respostaExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Resposta não encontrada." }] };
        }

        if (!resposta) {
            return { sucesso: false, erros: [{ campo: 'resposta', mensagem: "O campo resposta não pode estar vazio." }] };
        }

        const respostaAtualizada = { id, usuario_id, discussao_id, resposta };
        const resultadoAtualizacao = await respostaRepository.updateResposta(respostaAtualizada);
        return { sucesso: true, respostaAtualizada: resultadoAtualizacao };
    }

    async deletarResposta(id) {
        const respostaExistente = await respostaRepository.getRespostaById(id);
        if (!respostaExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Resposta não encontrada." }] };
        }
        await respostaRepository.deleteResposta(id);
        return { sucesso: true, mensagem: "Resposta deletada com sucesso." };
    }
}

module.exports = RespostaController;
