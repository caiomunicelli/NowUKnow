const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController.js');
const verifyJWT = require('../service/jwtService.js');
const usuarioController = new UsuarioController();
const jwt = require('jsonwebtoken');
const { compare } = require('bcryptjs');

const SECRET = process.env.SECRET_KEY || "zubas123";
const EXPIRES = 30000;

// Rota: Criar um usuário (POST /)
router.post('/', async (req, res) => {
    const { usuario, nome, email, senha, tipo, imagem } = req.body;
    try {
        const resultado = await usuarioController.criarUsuario(usuario, nome, email, senha, tipo, imagem);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(201).json(resultado.usuario); // Retorna o usuário criado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }
});

// Rota: Realizar login (POST /login)
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const resultado = await usuarioController.listarUsuarioPorEmail(email);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        
        const isPasswordMatch = await compare(senha, resultado.usuario.senha);
        if (isPasswordMatch) {
            const token = jwt.sign({ usuarioId: resultado.usuario.id }, SECRET, { expiresIn: EXPIRES });
            res.status(200).json({ auth: true, token });
        } else {
            return res.status(401).json({ errors: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(500).json({ errors: 'Erro ao fazer login', details: error.message });
    }
});

// Rota: Logout (POST /logout)
router.post('/logout', (req, res) => {
    res.status(200).json({ logout: true });
});

// Rota: Listar todos os usuários (GET /all)
router.get('/all', async (req, res) => {
    try {
        const resultado = await usuarioController.listarUsuarios();
        res.status(200).json(resultado.usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
    }
});

// Rota: Buscar usuário por ID (GET /)
router.get('/', verifyJWT, async (req, res) => {
    try {
        const resultado = await usuarioController.listarUsuarioPorId(req.usuarioId);
        if (!resultado.sucesso) {
            return res.status(404).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.usuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
});

// Rota: Atualizar usuário por ID (PUT /)
router.put('/', verifyJWT, async (req, res) => {
    const { usuario, nome, email, senha, tipo, imagem } = req.body;
    try {
        const resultado = await usuarioController.atualizarUsuario(req.usuarioId, usuario, nome, email, senha, tipo, imagem);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.usuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});

// Rota: Deletar usuário por ID (DELETE /)
router.delete('/', verifyJWT, async (req, res) => {
    try {
        const resultado = await usuarioController.deletarUsuario(req.usuarioId);
        if (!resultado.sucesso) {
            return res.status(404).json({ errors: resultado.erros });
        }
        res.status(200).json({ mensagem: resultado.mensagem });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
    }
});

module.exports = router;
