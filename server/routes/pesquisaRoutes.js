const express = require("express");
const router = express.Router();
const PesquisaController = require("../controllers/pesquisaController");

const pesquisaController = new PesquisaController();

router.get("/", async (req, res) => {
  const { query, filter } = req.query;

  if (!query || !filter) {
    return res.status(400).json({ error: "Parâmetros 'query' e 'filter' são obrigatórios." });
  }

  try {
    const resultado = await pesquisaController.realizarPesquisa(query, filter);

    if (!resultado.sucesso) {
      return res.status(404).json({ errors: resultado.erros });
    }

    res.status(200).json(resultado.dados);
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar a busca", details: error.message });
  }
});

module.exports = router;
