const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "./.env") });

console.log(process.env.BUCKET_NAME);

const app = express();
const port = process.env.PORT || 8080;

// Configuração de middlewares
app.use(cors());
app.use(express.json());

// Importação das rotas centralizadas
const apiRoutes = require("./routes/index.js");

// Define o prefixo para todas as rotas da API
app.use("/api/v1", apiRoutes);

// Servir arquivos estáticos da aplicação React
const clientPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientPath));

// Define a rota catch-all para o React
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
