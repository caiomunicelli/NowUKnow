const express = require("express");
const router = express.Router();
const DiscussaoController = require("../controllers/discussaoController.js");
const verifyJWT = require("../middleware/jwtService.js");

const discussaoController = new DiscussaoController();

// Rota: Criar uma discussão (POST /)
router.post("/", verifyJWT, async (req, res) => {
  const { postagemId, tipoDiscussao, texto } = req.body;

  try {
    const resultado = await discussaoController.criarDiscussao(
      postagemId,
      tipoDiscussao,
      texto
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ erros: resultado.erros });
    }
    res.status(201).json(resultado.discussao); // Retorna a discussão criada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar discussão", details: error.message });
  }
});

// Rota: Listar todas as discussões (GET /)
router.get("/", async (req, res) => {
  try {
    const resultado = await discussaoController.listarDiscussoes();
    res.status(200).json(resultado.discussoes); // Retorna a lista de discussões
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar discussões", details: error.message });
  }
});

// Rota: Buscar discussão por ID (GET /:id)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await discussaoController.listarDiscussaoPorId(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ erros: resultado.erros });
    }
    res.status(200).json(resultado.discussao); // Retorna a discussão encontrada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar discussão", details: error.message });
  }
});

// Rota: Buscar discussão por ID (GET /:id)
router.get("/postagem/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await discussaoController.listarDiscussaoPorPostagemId(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ erros: resultado.erros });
    }
    res.status(200).json(resultado.discussao); // Retorna a discussão encontrada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar discussão", details: error.message });
  }
});

// Rota: Atualizar discussão (PUT /:id)
router.put("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  const { postagemId, tipoDiscussao, texto } = req.body;

  try {
    const resultado = await discussaoController.atualizarDiscussao(
      id,
      postagemId,
      tipoDiscussao,
      texto
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ erros: resultado.erros });
    }
    res.status(200).json(resultado.discussao); // Retorna a discussão atualizada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar discussão", details: error.message });
  }
});

// Rota: Deletar discussão (DELETE /:id)
router.delete("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await discussaoController.deletarDiscussao(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ erros: resultado.erros });
    }
    res.status(200).json({ mensagem: resultado.mensagem });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar discussão", details: error.message });
  }
});

module.exports = router;
