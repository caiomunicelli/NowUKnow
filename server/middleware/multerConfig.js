const multer = require("multer");
const storage = multer.memoryStorage();

const tiposConteudo = {
  imagem: ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"],
  conteudo: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "video/mp4",
    "video/x-msvideo",
    "video/x-matroska",
    "video/quicktime",
  ],
};

const tamanhosMaximos = {
  imagem: 5 * 1024 * 1024, // 5 MB
  conteudo: 100 * 1024 * 1024, // 100 MB
};

const fileFilter = (req, file, cb, tipoConteudo) => {
  // Verificar se o tipo de conteúdo é válido
  if (!tiposConteudo[tipoConteudo]) {
    return cb(new Error("Tipo de conteúdo não suportado"));
  }

  // Verificar se o mimetype do arquivo está dentro do tipo de conteúdo esperado
  if (!tiposConteudo[tipoConteudo].includes(file.mimetype)) {
    return cb(new Error(`Tipo de arquivo não permitido para ${tipoConteudo}`));
  }

  // Tudo certo, aceitar o arquivo
  cb(null, true);
};

function multerConfig(tipoConteudo) {
  // Garantir que o tipoConteudo seja válido
  if (!tiposConteudo[tipoConteudo]) {
    throw new Error("Tipo de conteúdo inválido.");
  }

  return multer({
    storage: storage,
    fileFilter: (req, file, cb) => fileFilter(req, file, cb, tipoConteudo),
    limits: { fileSize: tamanhosMaximos[tipoConteudo] },
    onProgress: (req, res, progress) => {
      const percent = (progress.bytesWritten / progress.totalBytes) * 100;
      req.session.uploadProgress = percent;
    },
  });
}

module.exports = multerConfig;
