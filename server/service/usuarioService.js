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
      `INSERT INTO Usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)`,
      [usuario.nome, usuario.email, hashedPassword, usuario.tipo]
    );

    const newUser = {
      id: result.insertId,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
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
    const [rows] = await connection.execute(
      "SELECT * FROM Usuarios WHERE id = ?",
      [id]
    );

    return rows[0]; // Retorna o usuário encontrado ou undefined
  }

  async getUserByEmail(email) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Usuarios WHERE email = ?",
      [email]
    );

    return rows[0]; // Retorna o usuário encontrado ou undefined
  }

  async updateUser(usuario) {
    const connection = await this.dbConnection.connect();
    const hashedPassword = usuario.senha
      ? await bcrypt.hash(usuario.senha, 10)
      : null;

    const [result] = await connection.execute(
      `UPDATE Usuarios SET nome = ?, email = ?, senha = COALESCE(?, senha), tipo = ? WHERE id = ?`,
      [usuario.nome, usuario.email, hashedPassword, usuario.tipo, usuario.id]
    );

    return result.affectedRows > 0
      ? "Usuário alterado com sucesso."
      : "Nenhum usuário alterado.";
  }

  async deleteUser(id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      "DELETE FROM Usuarios WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0; // Retorna true se o usuário foi deletado
  }
}

module.exports = UserRepository;
