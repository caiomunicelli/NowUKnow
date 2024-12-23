const DatabaseConnection = require("../providers/databaseConnection.js");
const Avaliacao = require("../entities/avaliacao.js");

class AvaliacaoRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  // Criar uma nova avaliação
  async createAvaliacao(avaliacao) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `INSERT INTO Avaliacoes (usuario_id, postagem_id, feedback) 
             VALUES (?, ?, ?)`,
      [
        avaliacao.usuarioId,
        avaliacao.postagemId,
        avaliacao.feedback,
      ]
    );

    return new Avaliacao(
      result.insertId,
      avaliacao.usuarioId,
      avaliacao.postagemId,
      avaliacao.feedback,
      new Date() // Data de criação no momento da inserção
    );
  }

  // Buscar todas as avaliações
  async getAllAvaliacoes() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Avaliacoes");

    return rows.map(
      (row) =>
        new Avaliacao(
          row.id,
          row.usuario_id,
          row.postagem_id,
          row.feedback,
          row.data_avaliacao
        )
    );
  }

  // Buscar avaliação por ID
  async getAvaliacaoById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Avaliacoes WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Avaliacao(
      row.id,
      row.usuario_id,
      row.postagem_id,
      row.feedback,
      row.data_avaliacao
    );
  }

  // Atualizar uma avaliação por ID
  async updateAvaliacao(avaliacao) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `UPDATE Avaliacoes SET feedback = ? WHERE id = ?`,
      [avaliacao.feedback, avaliacao.id]
    );

    return result.affectedRows > 0
      ? "Avaliação atualizada com sucesso."
      : "Nenhuma avaliação foi alterada.";
  }

  // Deletar uma avaliação por ID
  async deleteAvaliacao(id) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      "DELETE FROM Avaliacoes WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0; // Retorna true se a avaliação foi deletada
  }

  // Buscar avaliações por postagem
  async getAvaliacoesPorPostagem(postagemId) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Avaliacoes WHERE postagem_id = ?",
      [postagemId]
    );

    return rows.map(
      (row) =>
        new Avaliacao(
          row.id,
          row.usuario_id,
          row.postagem_id,
          row.feedback,
          row.data_avaliacao
        )
    );
  }
}

module.exports = AvaliacaoRepository;
