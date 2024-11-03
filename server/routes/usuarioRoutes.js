const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController.js');
const verifyJWT = require('../service/jwtService.js');
const usuarioController = new UsuarioController(); // Instancia do controlador
const jwt = require('jsonwebtoken');
const { hash } = require('bcryptjs');
const SECRET = process.env.SECRET_KEY;
const EXPIRES = 30000;
// Rota: Criar um usuário (POST /)
router.post('/', async (req, res) => {
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
// Rota:Realiza login (POST /)
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const hashedPassword = await hash(senha, 10);
        const resultado = await usuarioController.listarUsuarioPorEmail(email);
        if (!resultado.sucesso)
            return res.status(400).json({ errors: resultado.erros });
        else{
            console.log()
            if(resultado.usuario.senha == hashedPassword){
                const token = jwt.sign({usuarioId:resultado.usuario.id}, SECRET, {expiresIn: EXPIRES})
                res.status(201).json({auth:true, token});
            }
            else{
                return res.status(401).json({errors: 'Credenciais inválidas' + resultado.usuario.senha + '  ' +  hashedPassword});
            }
        }
    } catch (error) {
        res.status(500).json({ errors: 'Credenciais inválidas', details: error.message });
    }
});
router.post('/logout', async (req, res) => {
    try {
        res.status(201).json({logout:true});
    } catch (error) {
        res.status(500).json({ errors: 'Credenciais inválidas', details: error.message });

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
router.get('/:id', verifyJWT, async (req, res) => {
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
router.put('/:id', verifyJWT, async (req, res) => {
    const { nome, email, senha, tipo } = req.body;
    try {
        const resultado = await usuarioController.atualizarUsuario(req.params.id, nome, email, senha, tipo);
        if (!resultado.sucesso) {
            return res.status(400).json({ errors: resultado.erros });
        }
        res.status(200).json(resultado.usuario); // Retorna o usuário atualizado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});

// Rota: Deletar usuário por ID (DELETE //:id)
router.delete('/:id', verifyJWT, async (req, res) => {
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
