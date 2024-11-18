const express = require("express");
const router = express.Router();

// Importação das rotas
const usuarioRoutes = require("./usuarioRoutes");
const conteudoRoutes = require("./conteudoRoutes");
const discussoesRoutes = require("./discussaoRoutes");
const aboutRoutes = require("./aboutRoutes");
const comentariosRoutes = require("./comentarioRoutes");
const avaliacaoRoutes = require("./avaliacaoRoutes");
const categoriaRoutes = require("./categoriaRoutes");
const certificacoesRoutes = require("./certificacaoRoutes");
const postagemRoutes = require("./postagemRoutes");

// Adiciona as rotas ao router principal
router.use("/usuarios", usuarioRoutes);
router.use("/conteudos", conteudoRoutes);
router.use("/discussoes", discussoesRoutes);
router.use("/about", aboutRoutes);
router.use("/comentarios", comentariosRoutes);
router.use("/avaliacoes", avaliacaoRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/certificacoes", certificacoesRoutes);
router.use("/postagens", postagemRoutes);

module.exports = router;
