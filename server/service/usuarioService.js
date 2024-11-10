const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const DatabaseConnection = require("../db/databaseConnection.js");
const Usuario = require("../models/usuario.js");

class UserRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  async createUser(usuario) {
    console.log("Criando usuário");
    const connection = await this.dbConnection.connect();
    const hashedPassword = await bcrypt.hash(usuario.senha, 10);

    const [result] = await connection.execute(
      `INSERT INTO Usuarios (usuario, nome, email, senha, imagem, tipo) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuario.usuario, 
        usuario.nome, 
        usuario.email, 
        hashedPassword, 
        usuario.imagem || null, 
        usuario.tipo || 'Basico'
      ]
    );

    const newUser = {
      id: result.insertId,
      usuario: usuario.usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo || 'Basico',
      imagem: usuario.imagem || null,
      data_criacao: new Date()  // Considerando a data atual como data_criacao
    };

    console.log("Usuário criado");
    return newUser;
  }

  async getAllUsers() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Usuarios");
    return rows; // Retorna todos os usuários
  }

  async getUserById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Usuarios WHERE id = ?", [id]);
    return rows[0]; // Retorna o usuário encontrado ou undefined
  }

  async getUserByEmail(email) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Usuarios WHERE email = ?", [email]);
    return rows[0]; // Retorna o usuário encontrado ou undefined
  }

  async getUserByUsername(username) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Usuarios WHERE usuario = ?", [username]);
    return rows[0]; // Retorna o usuário encontrado ou undefined
  }

  async updateUser(usuario) {
    const connection = await this.dbConnection.connect();
    const hashedPassword = usuario.senha ? await bcrypt.hash(usuario.senha, 10) : null;

    const [result] = await connection.execute(
      `UPDATE Usuarios SET usuario = ?, nome = ?, email = ?, senha = COALESCE(?, senha), imagem = ?, tipo = ? WHERE id = ?`,
      [
        usuario.usuario,
        usuario.nome,
        usuario.email,
        hashedPassword,
        usuario.imagem || null,
        usuario.tipo || 'Basico',
        usuario.id
      ]
    );

    return result.affectedRows > 0
      ? "Usuário alterado com sucesso."
      : "Nenhum usuário alterado.";
  }

  async deleteUser(id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute("DELETE FROM Usuarios WHERE id = ?", [id]);
    return result.affectedRows > 0; // Retorna true se o usuário foi deletado
  }
}

module.exports = UserRepository;
