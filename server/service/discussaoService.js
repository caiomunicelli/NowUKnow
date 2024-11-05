const mysql = require("mysql2/promise");
const DatabaseConnection = require("../db/databaseConnection.js");
const Discussao = require("../models/discussao.js");

class DiscussaoRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  async createDiscussao(discussao) {
    console.log("Criando discussão");
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `INSERT INTO Discussao (usuario_id, conteudo_id, pergunta) VALUES (?, ?, ?)`,
      [discussao.usuarioId, discussao.conteudoId, discussao.pergunta]
    );

    console.log("Discussão criada");
    const newDiscussao = {
      id: result.insertId,
      usuarioId: discussao.usuarioId,
      conteudoId: discussao.conteudoId,
      pergunta: discussao.pergunta,
    };

    return newDiscussao; // Retorna a discussão criada
  }

  async getAllDiscussoes() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Discussao");

    return rows; // Retorna todas as discussões
  }

  async getDiscussaoById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Discussao WHERE id = ?",
      [id]
    );

    return rows[0]; // Retorna a discussão encontrada ou undefined
  }

  async updateDiscussao(discussao) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `UPDATE Discussao SET usuario_id = ?, conteudo_id = ?, pergunta = ? WHERE id = ?`,
      [
        discussao.usuarioId,
        discussao.conteudoId,
        discussao.pergunta,
        discussao.id,
      ]
    );

    return result.affectedRows > 0; // Retorna true se a atualização foi bem-sucedida
  }

  async deleteDiscussao(id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      "DELETE FROM Discussao WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0; // Retorna true se a discussão foi deletada
  }
}

module.exports = DiscussaoRepository;
