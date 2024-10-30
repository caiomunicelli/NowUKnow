require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();
app.use(express.json());

// Sincroniza o modelo com o banco
sequelize.sync();

// Rota: Criar um usuário (POST /users)
app.post('/users', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hashedPassword, tipo });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
  }
});

// Rota: Listar todos os usuários (GET /users)
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
  }
});

// Rota: Buscar usuário por ID (GET /users/:id)
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
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
    const user = await User.findByPk(req.params.id);
    if (user) {
      if (senha) {
        req.body.senha = await bcrypt.hash(senha, 10);
      }
      await user.update({ nome, email, senha: req.body.senha, tipo });
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
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
  }
});