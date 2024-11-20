const express = require("express");
const router = express.Router();
const CertificacaoController = require("../controllers/certificacaoController.js");
const verifyJWT = require("../middleware/jwtService.js");

const certificacaoController = new CertificacaoController();

// Rota: Criar uma nova certificação (POST /)
router.post("/", verifyJWT, async (req, res) => {
  const { nome, descricao, requisitos, imagem, categoriaId, nivel } = req.body;
  try {
    const resultado = await certificacaoController.criarCertificacao(
      nome,
      descricao,
      requisitos,
      imagem,
      categoriaId,
      nivel
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ errors: resultado.erros });
    }
    res.status(201).json(resultado.certificacao);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar certificação", details: error.message });
  }
});

// Rota: Listar todas as certificações (GET /all)
router.get("/", async (req, res) => {
  try {
    const resultado = await certificacaoController.listarCertificacoes();
    res.status(200).json(resultado.certificacoes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao listar certificações", details: error.message });
  }
});

// Rota: Listar todas as certificações por categoria
router.get("/categoria/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await certificacaoController.listarCertificacoesPorCategoriaId(id);
    res.status(200).json(resultado.certificacoes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao listar certificações", details: error.message });
  }
});

// Rota: Buscar certificação por ID (GET /:id)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await certificacaoController.listarCertificacaoPorId(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ errors: resultado.erros });
    }
    res.status(200).json(resultado.certificacao);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar certificação", details: error.message });
  }
});

// Rota: Atualizar certificação por ID (PUT /:id)
router.put("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, requisitos, imagem, categoriaId, nivel } = req.body;
  try {
    const resultado = await certificacaoController.atualizarCertificacao(
      id,
      nome,
      descricao,
      requisitos,
      imagem,
      categoriaId,
      nivel
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ errors: resultado.erros });
    }
    res.status(200).json({ mensagem: resultado.mensagem });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Erro ao atualizar certificação",
        details: error.message,
      });
  }
});

// Rota: Deletar certificação por ID (DELETE /:id)
router.delete("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await certificacaoController.deletarCertificacao(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ errors: resultado.erros });
    }
    res.status(200).json({ mensagem: resultado.mensagem });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar certificação", details: error.message });
  }
});

module.exports = router;
