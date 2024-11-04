const ConteudoRepository = require('../service/serviceConteudo.js');
const Conteudo = require('../models/conteudo.js');

const conteudoRepository = new ConteudoRepository();

class ConteudoController {
    validarDados(conteudo) {
        const errors = [];

        if (!conteudo.titulo || conteudo.titulo.length === 0) {
            errors.push({ campo: 'titulo', mensagem: "O título é obrigatório." });
        }

        if (!conteudo.descricao || conteudo.descricao.length === 0) {
            errors.push({ campo: 'descricao', mensagem: "A descrição é obrigatória." });
        }

        const tiposPermitidos = ['video', 'documento', 'simulado', 'outro'];
        if (!conteudo.tipo_conteudo || !tiposPermitidos.includes(conteudo.tipo_conteudo)) {
            errors.push({ campo: 'tipo_conteudo', mensagem: "Tipo de conteúdo inválido." });
        }

        const niveisPermitidos = ['fácil', 'médio', 'difícil'];
        if (conteudo.nivel_dificuldade && !niveisPermitidos.includes(conteudo.nivel_dificuldade)) {
            errors.push({ campo: 'nivel_dificuldade', mensagem: "Nível de dificuldade inválido." });
        }

        return { isValid: errors.length === 0, errors };
    }

    async criarConteudo(titulo, descricao, tipo_conteudo, autor_id, nivel_dificuldade, duracao, categoria) {
        const conteudo = new Conteudo(0, titulo, descricao, tipo_conteudo, autor_id, null, nivel_dificuldade, duracao, categoria);
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
    
    async atualizarConteudo(id, titulo, descricao, tipo_conteudo, autor_id, nivel_dificuldade, duracao, categoria) {
        const conteudoExistente = await conteudoRepository.getConteudoById(id);
        if (!conteudoExistente) {
            return { sucesso: false, erros: [{ campo: 'id', mensagem: "Conteúdo não encontrado." }] };
        }

        const conteudoAtualizado = new Conteudo(id, titulo, descricao, tipo_conteudo, autor_id, conteudoExistente.data_upload, nivel_dificuldade, duracao, categoria);
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