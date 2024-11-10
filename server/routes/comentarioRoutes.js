const express = require('express');
const router = express.Router();
const ComentarioController = require('../controllers/comentarioController.js');
const verifyJWT = require('../service/jwtService.js');

const comentarioController = new ComentarioController();

// Rota: Criar um comentário (POST /)
router.post('/', verifyJWT, async (req, res) => {
    const { postagemId, usuarioId, texto, parentId } = req.body;

    try {
        const resultado = await comentarioController.criarComentario(postagemId, usuarioId, texto, parentId);
        if (!resultado.sucesso) {
            return res.status(400).json({ erros: resultado.erros });
        }
        res.status(201).json(resultado.comentario); // Retorna o comentário criado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar comentário', details: error.message });
    }
});

// Rota: Listar todos os comentários (GET /)
router.get('/', async (req, res) => {
    try {
        const resultado = await comentarioController.listarComentarios();
        res.status(200).json(resultado.comentarios); // Retorna a lista de comentários
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar comentários', details: error.message });
    }
});

// Rota: Buscar comentário por ID (GET /:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await comentarioController.listarComentarioPorId(id);
        if (!resultado.sucesso) {
            return res.status(404).json({ erros: resultado.erros });
        }
        res.status(200).json(resultado.comentario); // Retorna o comentário encontrado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar comentário', details: error.message });
    }
});

// Rota: Atualizar comentário (PUT /:id)
router.put('/:id', verifyJWT, async (req, res) => {
    const { id } = req.params;
    const { texto } = req.body;
    try {
        const resultado = await comentarioController.atualizarComentario(id, texto);
        if (!resultado.sucesso) {
            return res.status(400).json({ erros: resultado.erros });
        }
        res.status(200).json(resultado.comentario); // Retorna o comentário atualizado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar comentário', details: error.message });
    }
});

// Rota: Deletar comentário (DELETE /:id)
router.delete('/:id', verifyJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await comentarioController.deletarComentario(id);
        if (!resultado.sucesso) {
            return res.status(404).json({ erros: resultado.erros });
        }
        res.status(200).json({ mensagem: resultado.mensagem });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar comentário', details: error.message });
    }
});

module.exports = router;
