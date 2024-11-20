const express = require("express");
const router = express.Router();
const AvaliacaoController = require("../controllers/avaliacaoController.js");
const verifyJWT = require("../middleware/jwtService.js");

const avaliacaoController = new AvaliacaoController();

// Rota: Criar uma avaliação (POST /)
router.post("/", verifyJWT, async (req, res) => {
  const { usuarioId, postagemId, nota, comentario } = req.body;

  try {
    const resultado = await avaliacaoController.criarAvaliacao(
      usuarioId,
      postagemId,
      nota,
      comentario
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ erros: resultado.erros });
    }
    res.status(201).json(resultado.avaliacao); // Retorna a avaliação criada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar avaliação", details: error.message });
  }
});

// Rota: Listar todas as avaliações (GET /)
router.get("/", async (req, res) => {
  try {
    const resultado = await avaliacaoController.listarAvaliacoes();
    res.status(200).json(resultado.avaliacoes); // Retorna todas as avaliações
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar avaliações", details: error.message });
  }
});

// Rota: Listar avaliação por ID (GET /:id)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await avaliacaoController.listarAvaliacaoPorId(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ erros: resultado.erros });
    }
    res.status(200).json(resultado.avaliacao); // Retorna a avaliação encontrada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar avaliação", details: error.message });
  }
});

// Rota: Atualizar avaliação (PUT /:id)
router.put("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  const { nota, comentario } = req.body;
  try {
    const resultado = await avaliacaoController.atualizarAvaliacao(
      id,
      nota,
      comentario
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ erros: resultado.erros });
    }
    res.status(200).json(resultado.avaliacao); // Retorna a avaliação atualizada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar avaliação", details: error.message });
  }
});

// Rota: Deletar avaliação (DELETE /:id)
router.delete("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await avaliacaoController.deletarAvaliacao(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ erros: resultado.erros });
    }
    res.status(200).json({ mensagem: resultado.mensagem });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar avaliação", details: error.message });
  }
});

// Rota: Listar avaliações por postagem (GET /postagem/:postagemId)
router.get("/postagem/:postagemId", async (req, res) => {
  const { postagemId } = req.params;
  try {
    const resultado = await avaliacaoController.listarAvaliacoesPorPostagem(
      postagemId
    );
    res.status(200).json(resultado.avaliacoes); // Retorna as avaliações da postagem
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Erro ao buscar avaliações da postagem",
        details: error.message,
      });
  }
});

module.exports = router;
