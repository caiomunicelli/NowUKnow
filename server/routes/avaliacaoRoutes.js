const express = require('express');
const router = express.Router();
const AvaliacaoController = require('../controllers/avaliacaoController.js');

const avaliacaoController = new AvaliacaoController(); // Instância do controlador

// Rota: Criar uma avaliação (POST /)
router.post('/', async (req, res) => {
    console.log("Request POST recebido");
    const { usuario_id, conteudo_id, nota, comentario } = req.body;
    try {
        const resultado = await avaliacaoController.criarAvaliacao(usuario_id, conteudo_id, nota, comentario);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(201).json(resultado.avaliacao); // Retorna a avaliação criada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar avaliação', details: error.message });
    }
});

// Rota: Listar todas as avaliações (GET /)
router.get('/', async (req, res) => {
    try {
        const resultado = await avaliacaoController.listarAvaliacoes();
        res.status(200).json(resultado.avaliacoes); // Retorna a lista de avaliações
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar avaliações', details: error.message });
    }
});

// Rota: Buscar avaliação por ID (GET /:id)
router.get('/:id', async (req, res) => {
    try {
        const resultado = await avaliacaoController.listarAvaliacaoPorId(req.params.id);
        if (!resultado.sucesso) {
            return res.status(404).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.avaliacao); // Retorna a avaliação encontrada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar avaliação', details: error.message });
    }
});

// Rota: Atualizar avaliação por ID (PUT /:id)
router.put('/:id', async (req, res) => {
    const { usuario_id, conteudo_id, nota, comentario } = req.body;
    try {
        const resultado = await avaliacaoController.atualizarAvaliacao(req.params.id, usuario_id, conteudo_id, nota, comentario);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.avaliacaoAtualizada); // Retorna a avaliação atualizada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar avaliação', details: error.message });
    }
});

// Rota: Deletar avaliação por ID (DELETE /:id)
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await avaliacaoController.deletarAvaliacao(req.params.id);
        if (!resultado.sucesso) {
            return res.status(404).json({ errors: resultado.erros });
        }
        res.status(200).json({ mensagem: resultado.mensagem }); // Retorna a mensagem de sucesso
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar avaliação', details: error.message });
    }
});

module.exports = router;