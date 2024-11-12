const express = require("express");
const router = express.Router();
const ConteudoController = require("../controllers/conteudoController.js");
const verifyJWT = require("../service/jwtService.js");
const conteudoController = new ConteudoController();
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const arquivosPermitidos = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "video/mp4",
      "video/x-msvideo", // .avi
      "video/x-matroska", // .mkv
      "video/quicktime", // .mov
    ];
    if (arquivosPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Tipo de arquivo não permitido. Apenas PDFs, documentos Word, apresentações PowerPoint e vídeos são aceitos."
        )
      );
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 },
});

// Rota: Criar um conteúdo (POST /)
router.post("/", verifyJWT, upload.single("arquivo"), async (req, res) => {
  const { postagem_id, tipo_conteudo, descricao } = req.body;
  const arquivo = req.file; // Acessa o arquivo carregado
  console.log("arquivo = ", arquivo);
  try {
    const resultado = await conteudoController.criarConteudo(
      postagem_id,
      tipo_conteudo,
      arquivo,
      descricao
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ errors: resultado.erros });
    }
    res.status(201).json(resultado.conteudo); // Retorna o conteúdo criado
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar conteúdo", details: error.message });
  }
});

// Rota: Listar todos os conteúdos (GET /)
router.get("/", async (req, res) => {
  try {
    const resultado = await conteudoController.listarConteudos();
    res.status(200).json(resultado.conteudos); // Retorna a lista de conteúdos
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar conteúdos", details: error.message });
  }
});

// Rota: Buscar conteúdo por ID (GET /:id)
router.get("/:id", async (req, res) => {
  try {
    const resultado = await conteudoController.listarConteudoPorId(
      req.params.id
    );
    if (!resultado.sucesso) {
      return res.status(404).json({ errors: resultado.erros });
    }
    res.status(200).json(resultado.conteudo); // Retorna o conteúdo encontrado
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar conteúdo", details: error.message });
  }
});

// Rota: Atualizar conteúdo por ID (PUT /:id)
router.put("/:id", verifyJWT, async (req, res) => {
  const { postagem_id, tipo_conteudo, url, descricao } = req.body;
  try {
    const resultado = await conteudoController.atualizarConteudo(
      req.params.id,
      postagem_id,
      tipo_conteudo,
      url,
      descricao
    );
    if (!resultado.sucesso) {
      return res.status(400).json({ errors: resultado.erros });
    }
    res.status(200).json(resultado.conteudo); // Retorna o conteúdo atualizado
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar conteúdo", details: error.message });
  }
});

// Rota: Deletar conteúdo por ID (DELETE /:id)
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const resultado = await conteudoController.deletarConteudo(req.params.id);
    if (!resultado.sucesso) {
      return res.status(404).json({ errors: resultado.erros });
    }
    res.status(200).json({ mensagem: resultado.mensagem }); // Retorna a mensagem de sucesso
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar conteúdo", details: error.message });
  }
});

module.exports = router;
