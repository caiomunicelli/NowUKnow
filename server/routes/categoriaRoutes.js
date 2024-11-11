const express = require("express");
const router = express.Router();
const CategoriaController = require("../controllers/categoriaController.js");
const verifyJWT = require("../service/jwtService.js"); // Middleware de autenticação
const categoriaController = new CategoriaController(); // Instância do controlador

// Rota: Criar uma nova categoria (POST /) - Protegida com JWT
router.post("/", verifyJWT, async (req, res) => {
  const { nome, descricao, imagem } = req.body;
  try {
    const resultado = await categoriaController.criarCategoria(
      nome,
      descricao,
      imagem
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ errors: resultado.erros });
    }
    res.status(201).json(resultado.categoria); // Retorna a categoria criada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar categoria", details: error.message });
  }
});

// Rota: Listar todas as categorias (GET /)
router.get("/", async (req, res) => {
  try {
    const resultado = await categoriaController.listarCategorias();
    res.status(200).json(resultado.categorias); // Retorna a lista de categorias
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar categorias", details: error.message });
  }
});

// Rota: Buscar categoria por ID (GET /:id)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await categoriaController.listarCategoriaPorId(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ errors: resultado.erros });
    }
    res.status(200).json(resultado.categoria); // Retorna a categoria encontrada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar categoria", details: error.message });
  }
});

// Rota: Buscar categoria por nome (GET /search?nome=nome)
router.get("/search", async (req, res) => {
  const { nome } = req.query;
  try {
    const resultado = await categoriaController.listarCategoriaPorNome(nome);
    if (!resultado.sucesso) {
      return res.status(404).json({ errors: resultado.erros });
    }
    res.status(200).json(resultado.categorias); // Retorna as categorias encontradas
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar categorias", details: error.message });
  }
});

// Rota: Atualizar categoria por ID (PUT /:id) - Protegida com JWT
router.put("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, imagem } = req.body;
  try {
    const resultado = await categoriaController.atualizarCategoria(
      id,
      nome,
      descricao,
      imagem
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ errors: resultado.erros });
    }
    res.status(200).json(resultado.categoria); // Retorna a categoria atualizada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar categoria", details: error.message });
  }
});

// Rota: Deletar categoria por ID (DELETE /:id) - Protegida com JWT
router.delete("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await categoriaController.deletarCategoria(id);
    if (!resultado.sucesso) {
      return res.status(404).json({ errors: resultado.erros });
    }
    res.status(200).json({ mensagem: resultado.mensagem }); // Retorna a mensagem de sucesso
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar categoria", details: error.message });
  }
});

module.exports = router;
