const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const clientPath = path.join(__dirname, "../client/dist");
const port = process.env.PORT || 8080;
require("dotenv").config({ path: path.join(__dirname, "./.env") });

app.use(cors());
app.use(express.json());

//Rota de Usuario
const usuarioRoutes = require("./routes/usuarioRoutes.js");
app.use("/api/v1/usuarios", usuarioRoutes);

//Rota de Usuario
const conteudoRoutes = require("./routes/conteudoRoutes.js");
app.use("/api/v1/conteudos", conteudoRoutes);

//Rota de Discussoes
const discussoesRoutes = require("./routes/discussaoRoutes.js");
app.use("/api/v1/discussoes", discussoesRoutes);

//Rota de About
const aboutRoutes = require("./routes/aboutRoutes.js");
app.use("/api/v1/about", aboutRoutes);

//Rota de Respostas
const respostaRoutes = require("./routes/respostaRoutes.js");
app.use("/api/v1/respostas", respostaRoutes);

//Rota de Avaliacoes
const avaliacaoRoutes = require("./routes/avaliacaoRoutes.js");
app.use("/api/v1/avaliacoes", avaliacaoRoutes);

app.use(express.static(clientPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// Inicia o servidor
app.listen(port, () => {
  console.log(
    `Servidor rodando em https://nowuknow-dev.azurewebsites.net:${port}`
  );
});
