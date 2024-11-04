const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const path = require("path");
const clientPath = path.join(__dirname, "../client/dist");

app.use(cors());
app.use(express.json());

//Rota de Usuario
const usuarioRoutes = require("./routes/usuarioRoutes.js");
app.use("/api/users", usuarioRoutes);

// //Rota de Discussoes
// const discussoesRoutes = require("./routes/discussaoRoutes.js");
// app.use("/api/discussoes", discussoesRoutes);

// //Rota de Respostas
// const respostaRoutes = require("./routes/respostaRoutes.js");
// app.use("/api/respostas", respostaRoutes);

// //Rota de Avaliacoes
// const avaliacaoRoutes = require("./routes/avaliacaoRoutes.js");
// app.use("/api/avaliacoes", avaliacaoRoutes);

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
