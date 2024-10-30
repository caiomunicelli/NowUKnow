const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const UserRepository = require('./controllers/usuarioController.js');
const path = require('path');
const clientPath = path.join(__dirname, '../client/')


// Rota principal
app.get('/', (req, res) => {
  res.sendFile('/index.html', {root : clientPath});
});

const usuarioRoutes = require('./routes/usuarioRoutes.js')
app.use('/users', usuarioRoutes);


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em https://nowuknow-dev.azurewebsites.net:${port}`);
});

