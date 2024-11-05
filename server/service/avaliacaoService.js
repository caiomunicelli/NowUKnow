const mysql = require("mysql2/promise");
const DatabaseConnection = require("../db/databaseConnection.js");

class AvaliacaoRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  async createAvaliacao(avaliacao) {
    console.log("Criando avaliação");
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `INSERT INTO Avaliacoes (usuario_id, conteudo_id, nota, comentario) VALUES (?, ?, ?, ?)`,
      [
        avaliacao.usuario_id,
        avaliacao.conteudo_id,
        avaliacao.nota,
        avaliacao.comentario,
      ]
    );

    console.log("Avaliação criada");
    // Retorna a avaliação criada com o ID gerado
    return {
      id: result.insertId,
      ...avaliacao,
    };
  }

  async getAllAvaliacoes() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Avaliacoes");

    return rows; // Retorna todas as avaliações
  }

  async getAvaliacaoById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Avaliacoes WHERE id = ?",
      [id]
    );

    return rows[0]; // Retorna a avaliação encontrada ou undefined
  }

  async updateAvaliacao(avaliacao) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `UPDATE Avaliacoes SET usuario_id = ?, conteudo_id = ?, nota = ?, comentario = ? WHERE id = ?`,
      [
        avaliacao.usuario_id,
        avaliacao.conteudo_id,
        avaliacao.nota,
        avaliacao.comentario,
        avaliacao.id,
      ]
    );

    return result.affectedRows > 0; // Retorna true se a atualização foi bem-sucedida
  }

  async deleteAvaliacao(id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      "DELETE FROM Avaliacoes WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0; // Retorna true se a avaliação foi deletada
  }
}

module.exports = AvaliacaoRepository;
