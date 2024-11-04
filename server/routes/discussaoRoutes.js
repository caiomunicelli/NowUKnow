const express = require('express');
const router = express.Router();
const DiscussaoController = require('../controllers/discussaoController.js');

const discussaoController = new DiscussaoController(); // Instancia do controlador

// Rota: Criar uma discussão (POST /)
router.post('/', async (req, res) => {
    console.log("Request POST recebido");
    const { usuarioId, conteudoId, pergunta } = req.body;
    try {
        const resultado = await discussaoController.criarDiscussao(usuarioId, conteudoId, pergunta);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(201).json(resultado.discussao); // Retorna a discussão criada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar discussão', details: error.message });
    }
});

// Rota: Listar todas as discussões (GET /)
router.get('/', async (req, res) => {
    try {
        const resultado = await discussaoController.listarDiscussoes();
        res.status(200).json(resultado.discussao); // Retorna a lista de discussões
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar discussões', details: error.message });
    }
});

// Rota: Buscar discussão por ID (GET /:id)
router.get('/:id', async (req, res) => {
    try {
        const resultado = await discussaoController.listarDiscussaoPorId(req.params.id);
        if (!resultado.sucesso) {
            return res.status(404).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.discussao); // Retorna a discussão encontrada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar discussão', details: error.message });
    }
});

// Rota: Atualizar discussão por ID (PUT /:id)
router.put('/:id', async (req, res) => {
    const { usuarioId, conteudoId, pergunta } = req.body;
    try {
        const resultado = await discussaoController.atualizarDiscussao(req.params.id, usuarioId, conteudoId, pergunta);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.discussaoAtualizada); // Retorna a discussão atualizada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar discussão', details: error.message });
    }
});

// Rota: Deletar discussão por ID (DELETE /:id)
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await discussaoController.deletarDiscussao(req.params.id);
        if (!resultado.sucesso) {
            return res.status(404).json({ errors: resultado.erros });
        }
        res.status(200).json({ mensagem: resultado.mensagem }); // Retorna a mensagem de sucesso
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar discussão', details: error.message });
    }
});

module.exports = router;
