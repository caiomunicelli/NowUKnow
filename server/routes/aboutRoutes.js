const express = require('express');
const router = express.Router();
const AboutController = require('../controllers/aboutController.js');
const aboutController = new AboutController(); // Instância do controlador

// Rota: Listar todas as avaliações (GET /)
router.get('/', async (req, res) => {
    try {
        const resultado = await aboutController.listarAutores();
        res.status(200).json(resultado); // Retorna a lista de avaliações
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar autores', details: error.message });
    }
});

module.exports = router;