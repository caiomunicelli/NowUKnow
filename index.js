const express = require('express');
const app = express();
const port = 3000; // Porta que a aplicação irá escutar

// Rota principal
app.get('/', (req, res) => {
  res.send('Bem-vindo ao NowUKnow! Plataforma de aprendizado democrático.');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
