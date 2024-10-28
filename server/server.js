const express = require('express');
const path = require('path');
const clientPath = path.join(__dirname, '../client/')
const app = express();
const port = 3000; // Porta que a aplicação irá escutar

// Rota principal
app.get('/', (req, res) => {
  res.sendFile('/index.html', {root : clientPath});
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
