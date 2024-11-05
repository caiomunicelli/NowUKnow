const express = require('express');
const router = express.Router();
const RespostaController = require('../controllers/respostaController.js');
const verifyJWT = require('../service/jwtService.js');

const respostaController = new RespostaController(); // Instância do controlador

// Rota: Criar uma resposta (POST /)
router.post('/', verifyJWT, async (req, res) => {
    console.log("Request POST recebido");
    const { discussao_id, resposta } = req.body;
    try {
        const resultado = await respostaController.criarResposta(req.usuarioId, discussao_id, resposta);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(201).json(resultado.resposta); // Retorna a resposta criada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar resposta', details: error.message });
    }
});

// Rota: Listar todas as respostas (GET /)
router.get('/', async (req, res) => {
    try {
        const resultado = await respostaController.listarRespostas();
        res.status(200).json(resultado.respostas); // Retorna a lista de respostas
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar respostas', details: error.message });
    }
});

// Rota: Buscar resposta por ID (GET /:id)
router.get('/:id', async (req, res) => {
    try {
        const resultado = await respostaController.listarRespostaPorId(req.params.id);
        if (!resultado.sucesso) {
            return res.status(404).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.resposta); // Retorna a resposta encontrada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar resposta', details: error.message });
    }
});

// Rota: Atualizar resposta por ID (PUT /:id)
router.put('/:id',verifyJWT, async (req, res) => {
    const { discussao_id, resposta } = req.body;
    try {
        const resultado = await respostaController.atualizarResposta(req.params.id, req.usuarioId, discussao_id, resposta);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.respostaAtualizada); // Retorna a resposta atualizada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar resposta', details: error.message });
    }
});

// Rota: Deletar resposta por ID (DELETE /:id)
router.delete('/:id', verifyJWT, async (req, res) => {
    try {
        const resultado = await respostaController.deletarResposta(req.params.id);
        if (!resultado.sucesso) {
            return res.status(404).json({ errors: resultado.erros });
        }
        res.status(200).json({ mensagem: resultado.mensagem }); // Retorna a mensagem de sucesso
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar resposta', details: error.message });
    }
});

module.exports = router;