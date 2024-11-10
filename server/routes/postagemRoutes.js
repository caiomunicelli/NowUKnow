const express = require('express');
const router = express.Router();
const PostagemController = require('../controllers/postagemController.js');
const verifyJWT = require('../service/jwtService.js');

const postagemController = new PostagemController();

// Rota: Criar uma postagem (POST /)
router.post('/', verifyJWT, async (req, res) => {
    const { titulo, tipoPostagem, autorId, categoriaId, certificacaoId } = req.body;

    try {
        const resultado = await postagemController.criarPostagem(titulo, tipoPostagem, autorId, categoriaId, certificacaoId);
        if (!resultado.sucesso) {
            return res.status(400).json({ erros: resultado.erros });
        }
        res.status(201).json(resultado.postagem); // Retorna a postagem criada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar postagem', details: error.message });
    }
});

// Rota: Listar todas as postagens (GET /)
router.get('/', async (req, res) => {
    try {
        const resultado = await postagemController.listarPostagens();
        res.status(200).json(resultado.postagens); // Retorna a lista de postagens
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar postagens', details: error.message });
    }
});

// Rota: Buscar postagem por ID (GET /:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await postagemController.listarPostagemPorId(id);
        if (!resultado.sucesso) {
            return res.status(404).json({ erros: resultado.erros });
        }
        res.status(200).json(resultado.postagem); // Retorna a postagem encontrada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar postagem', details: error.message });
    }
});

// Rota: Atualizar postagem (PUT /:id)
router.put('/:id', verifyJWT, async (req, res) => {
    const { id } = req.params;
    const { titulo, tipoPostagem, autorId, categoriaId, certificacaoId } = req.body;

    try {
        const resultado = await postagemController.atualizarPostagem(id, titulo, tipoPostagem, autorId, categoriaId, certificacaoId);
        if (!resultado.sucesso) {
            return res.status(400).json({ erros: resultado.erros });
        }
        res.status(200).json(resultado.postagem); // Retorna a postagem atualizada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar postagem', details: error.message });
    }
});

// Rota: Deletar postagem (DELETE /:id)
router.delete('/:id', verifyJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await postagemController.deletarPostagem(id);
        if (!resultado.sucesso) {
            return res.status(400).json({ erros: resultado.erros });
        }
        res.status(200).json({ mensagem: resultado.mensagem }); // Retorna a mensagem de sucesso
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar postagem', details: error.message });
    }
});

module.exports = router;
