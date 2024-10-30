const express = require('express');
const path = require('path');
const clientPath = path.join(__dirname, '../client/')
const app = express();
const port = process.env.PORT || 8080;
const UserRepository = require('./controllers/userController.js');


// Rota principal
app.get('/', (req, res) => {
  res.sendFile('/index.html', {root : clientPath});
});



app.use(express.json());
const userRepository = new UserRepository();
// Rota: Criar um usuário (POST /users)
app.post('/users', async (req, res) => {
    console.log("Request POST recebido")
    const { nome, email, senha, tipo } = req.body;
    try {
        const user = await userRepository.createUser(nome, email, senha, tipo);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }
});

// Rota: Listar todos os usuários (GET /users)
app.get('/users', async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
    }
});

// Rota: Buscar usuário por ID (GET /users/:id)
app.get('/users/:id', async (req, res) => {
    try {
        const user = await userRepository.getUserById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
});

// Rota: Atualizar usuário por ID (PUT /users/:id)
app.put('/users/:id', async (req, res) => {
    const { nome, email, senha, tipo } = req.body;
    try {
        const user = await userRepository.updateUser(req.params.id, nome, email, senha, tipo);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});

// Rota: Deletar usuário por ID (DELETE /users/:id)
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await userRepository.getUserById(req.params.id);
        if (user) {
            await userRepository.deleteUser(req.params.id);
            res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
    }
});
// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em https://nowuknow-dev.azurewebsites.net:${port}`);
});

