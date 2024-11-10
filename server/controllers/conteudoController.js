const ConteudoRepository = require('../service/conteudoService.js');
const Conteudo = require('../models/conteudo.js');

const conteudoRepository = new ConteudoRepository();

class ConteudoController {
    validarDados(conteudo) {
        const errors = [];

        if (!conteudo.postagem_id) {
            errors.push({ campo: 'postagem_id', mensagem: "O ID da postagem é obrigatório." });
        }

        const tiposPermitidos = ['Video', 'Material_de_Aprendizado'];
        if (!conteudo.tipo_conteudo || !tiposPermitidos.includes(conteudo.tipo_conteudo)) {
            errors.push({ campo: 'tipo_conteudo', mensagem: "Tipo de conteúdo inválido." });
        }

        if (!conteudo.url || conteudo.url.length === 0) {
            errors.push({ campo: 'url', mensagem: "A URL é obrigatória." });
        }

        return { isValid: errors.length === 0, errors };
    }

    async criarConteudo(postagem_id, tipo_conteudo, url, descricao) {
        const conteudo = new Conteudo(0, postagem_id, tipo_conteudo, url, descricao || null);
        const validacao = this.validarDados(conteudo);

        if (!validacao.isValid) {
            return { sucesso: false, erros: validacao.errors };
        }
        const novoConteudo = await conteudoRepository.createConteudo(conteudo);
        return { sucesso: true, conteudo: novoConteudo };
    }
    
    async listarConteudos() {
        const conteudos = await conteudoRepository.getAllConteudos();
        return { sucesso: true, conteudos };
    }

    async listarConteudoPorId(id) {
        const conteudo = await conteudoRepository.getConteudoById(id);
        if (!conteudo) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Conteúdo não encontrado." }] };
        }
        return { sucesso: true, conteudo };
    }
    
    async atualizarConteudo(id, postagem_id, tipo_conteudo, url, descricao) {
        const conteudoExistente = await conteudoRepository.getConteudoById(id);
        if (!conteudoExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Conteúdo não encontrado." }] };
        }

        const conteudoAtualizado = new Conteudo(id, postagem_id, tipo_conteudo, url, descricao || conteudoExistente.descricao);
        const validacao = this.validarDados(conteudoAtualizado);

        if (!validacao.isValid) {
            return { sucesso: false, erros: validacao.errors };
        }

        const resultadoAtualizacao = await conteudoRepository.updateConteudo(conteudoAtualizado);
        return { sucesso: true, conteudo: resultadoAtualizacao };
    }

    async deletarConteudo(id) {
        const conteudoExistente = await conteudoRepository.getConteudoById(id);
        if (!conteudoExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Conteúdo não encontrado." }] };
        }
        await conteudoRepository.deleteConteudo(id);
        return { sucesso: true, mensagem: "Conteúdo deletado com sucesso." };
    }

    async listarConteudosComAutor() {
        const conteudosComAutor = await conteudoRepository.getConteudosComAutor();
        return { sucesso: true, conteudos: conteudosComAutor };
    }
}

module.exports = ConteudoController;
