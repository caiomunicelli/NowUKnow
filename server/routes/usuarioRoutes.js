const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController.js');

const usuarioController = new UsuarioController(); // Instancia do controlador

// Rota: Criar um usuário (POST /)
router.post('/', async (req, res) => {
    console.log("Request POST recebido");
    const { nome, email, senha, tipo } = req.body;
    try {
        const resultado = await usuarioController.criarUsuario(nome, email, senha, tipo);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(201).json(resultado.usuario); // Retorna o usuário criado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }
});

// Rota: Listar todos os usuários (GET /)
router.get('/', async (req, res) => {
    try {
        const resultado = await usuarioController.listarUsuarios();
        res.status(200).json(resultado.usuarios); // Retorna a lista de usuários
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
    }
});

// Rota: Buscar usuário por ID (GET //:id)
router.get('/:id', async (req, res) => {
    try {
        const resultado = await usuarioController.listarUsuarioPorId(req.params.id);
        if (!resultado.sucesso) {
            return res.status(404).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.usuario); // Retorna o usuário encontrado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
});

// Rota: Atualizar usuário por ID (PUT //:id)
router.put('/:id', async (req, res) => {
    const { nome, email, senha, tipo } = req.body;
    try {
        const resultado = await usuarioController.atualizarUsuario(req.params.id, nome, email, senha, tipo);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.usuarioAtualizado); // Retorna o usuário atualizado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});

// Rota: Deletar usuário por ID (DELETE //:id)
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await usuarioController.deletarUsuario(req.params.id);
        if (!resultado.sucesso) {
            return res.status(404).json({ errors: resultado.erros });
        }
        res.status(200).json({ mensagem: resultado.mensagem }); // Retorna a mensagem de sucesso
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
    }
});

module.exports = router;
