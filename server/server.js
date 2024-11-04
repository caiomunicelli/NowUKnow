const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const clientPath = path.join(__dirname, '../client/')

app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.sendFile('/index.html', {root : clientPath});
});

const usuarioRoutes = require('./routes/usuarioRoutes.js')
app.use('/usuario', usuarioRoutes);
const conteudoRoutes = require('./routes/conteudoRoutes.js')
app.use('/conteudo', conteudoRoutes);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em https://nowuknow-dev.azurewebsites.net:${port}`);
});

