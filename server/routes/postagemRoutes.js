const express = require("express");
const router = express.Router();
const PostagemController = require("../controllers/postagemController.js");
const verifyJWT = require("../middleware/jwtService.js");

const postagemController = new PostagemController();

// Rota: Criar uma postagem (POST /)
router.post("/", verifyJWT, async (req, res) => {
  const { titulo, tipoPostagem, autorId, categoriaId, certificacaoId } =
    req.body;

  try {
    const resultado = await postagemController.criarPostagem(
      titulo,
      tipoPostagem,
      req.usuarioId,
      categoriaId,
      certificacaoId
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ erros: resultado.erros });
    }
    res.status(201).json(resultado.postagem); // Retorna a postagem criada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar postagem", details: error.message });
  }
});

router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const resultado = await postagemController.deletarPostagem(req.params.id);
    if (!resultado.sucesso) {
      return res.status(404).json({ errors: resultado.erros });
    }
    res.status(200).json({ mensagem: resultado.mensagem }); // Retorna a mensagem de sucesso
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar postagem", details: error.message });
  }
});

router.put("/:id", verifyJWT, async (req, res) => {
  const { titulo, tipoPostagem, autorId, categoriaId, certificacaoId } =
    req.body;
  console.log("Body:", req.body);
  try {
    const resultado = await postagemController.atualizarPostagem(
      req.params.id,
      titulo,
      tipoPostagem,
      req.usuarioId,
      categoriaId,
      certificacaoId
    );
    if (!resultado.sucesso) {
      return res.status(404).json({ errors: resultado.erros });
    }
    res.status(200).json({
      mensagem: resultado.mensagem,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar postagem", details: error.message });
  }
});

// Rota: Listar todas as postagens (GET /)
router.get("/", async (req, res) => {
  try {
    const resultado = await postagemController.listarPostagens();
    res.status(200).json(resultado.postagens); // Retorna a lista de postagens
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar postagens", details: error.message });
  }
});

router.get("/allDetails", async (req, res) => {
  try {
    const resultado = await postagemController.listarPostagensComDetalhes();
    res.status(200).json(resultado.postagens); // Retorna a lista de postagens
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar postagens", details: error.message });
  }
});

router.get("/allDetails/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado =
      await postagemController.listarPostagensComDetalhesPorCategoriaId(id);
    res.status(200).json(resultado.postagens); // Retorna a lista de postagens
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar postagens", details: error.message });
  }
});

router.get("/allDetails/autor/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado =
      await postagemController.listarPostagensComDetalhesPorAutorId(id);
    res.status(200).json(resultado.postagens); // Retorna a lista de postagens
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar postagens", details: error.message });
  }
});

// Rota: Buscar postagens por título (GET /titulo)
router.get("/titulo/:titulo", async (req, res) => {
  const { titulo } = req.params;
  try {
    const resultado = await postagemController.listarPostagemPorTitulo(titulo);
    if (!resultado.sucesso) {
      return res.status(404).json({ erros: resultado.erros });
    }
    res.status(200).json(resultado.postagens); // Retorna as postagens encontradas
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar postagens por título",
      details: error.message,
    });
  }
});

// Rota: Buscar postagens por categoriaId (GET /categoria/:id)
router.get("/categoria/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await postagemController.listarPostagemPorCategoria(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ erros: resultado.erros });
    }
    res.status(200).json(resultado.postagens); // Retorna as postagens encontradas
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar postagens por categoria",
      details: error.message,
    });
  }
});

// Rota: Buscar postagens por autorId (GET /autor/:id)
router.get("/autor/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await postagemController.listarPostagemPorAutor(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ erros: resultado.erros });
    }
    res.status(200).json(resultado.postagens); // Retorna as postagens encontradas
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar postagens por autor",
      details: error.message,
    });
  }
});

// Rota: Buscar postagens por certificacaoId (GET /certificacao/:id)
router.get("/certificacao/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await postagemController.listarPostagemPorCertificacao(
      id
    );
    if (!resultado.sucesso) {
      return res.status(404).json({ erros: resultado.erros });
    }
    res.status(200).json(resultado.postagens); // Retorna as postagens encontradas
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar postagens por certificação",
      details: error.message,
    });
  }
});

module.exports = router;
