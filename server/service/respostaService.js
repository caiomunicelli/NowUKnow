const mysql = require("mysql2/promise");
const DatabaseConnection = require("../db/databaseConnection.js");
const Resposta = require("../models/resposta.js");

class RespostaRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  async createResposta(resposta) {
    console.log("Criando resposta");
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `INSERT INTO Respostas (usuario_id, discussao_id, resposta) VALUES (?, ?, ?)`,
      [resposta.usuario_id, resposta.discussao_id, resposta.resposta]
    );

    console.log("Resposta criada");
    const newResposta = {
      id: result.insertId,
      usuario_id: resposta.usuario_id,
      discussao_id: resposta.discussao_id,
      resposta: resposta.resposta,
    };

    return newResposta; // Retorna a resposta criada
  }

  async getAllRespostas() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Respostas");

    return rows; // Retorna todas as respostas
  }

  async getRespostaById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Respostas WHERE id = ?",
      [id]
    );

    return rows[0]; // Retorna a resposta encontrada ou undefined
  }

  async updateResposta(resposta) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `UPDATE Respostas SET usuario_id = ?, discussao_id = ?, resposta = ? WHERE id = ?`,
      [
        resposta.usuario_id,
        resposta.discussao_id,
        resposta.resposta,
        resposta.id,
      ]
    );

    return result.affectedRows > 0; // Retorna true se a atualização foi bem-sucedida
  }

  async deleteResposta(id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      "DELETE FROM Respostas WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0; // Retorna true se a resposta foi deletada
  }
}

module.exports = RespostaRepository;
