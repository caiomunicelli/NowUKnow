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

//Rota de Usuario
const usuarioRoutes = require('./routes/usuarioRoutes.js')
app.use('/users', usuarioRoutes);

//Rota de Discussoes
const discussoesRoutes = require('./routes/discussaoRoutes.js')
app.use('/discussoes', discussoesRoutes);

//Rota de Respostas
const respostaRoutes = require('./routes/respostaRoutes.js')
app.use('/respostas', respostaRoutes);

//Rota de Avaliacoes
const avaliacaoRoutes = require('./routes/avaliacaoRoutes.js')
app.use('/avaliacoes', avaliacaoRoutes);


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em https://nowuknow-dev.azurewebsites.net:${port}`);
});

