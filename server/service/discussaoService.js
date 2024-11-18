const DatabaseConnection = require("../providers/databaseConnection.js");

class DiscussaoRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  // Criar discussão
  async createDiscussao(discussao) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `INSERT INTO Discussoes (postagem_id, tipo_discussao, texto) VALUES (?, ?, ?)`,
      [discussao.postagemId, discussao.tipoDiscussao, discussao.texto]
    );

    return {
      id: result.insertId,
      ...discussao,
    };
  }

  // Buscar todas as discussões
  async getAllDiscussoes() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Discussoes");

    return rows;
  }

  // Buscar discussão por ID
  async getDiscussaoById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Discussoes WHERE id = ?",
      [id]
    );

    return rows[0];
  }

  // Buscar discussão por postagem_id
  async getDiscussaoByPostagemId(postagem_id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Discussoes WHERE postagem_id = ?",
      [postagem_id]
    );

    return rows[0];
  }

  // Atualizar discussão
  async updateDiscussao(discussao) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `UPDATE Discussoes SET tipo_discussao = ?, texto = ? WHERE id = ?`,
      [discussao.tipoDiscussao, discussao.texto, discussao.id]
    );

    return result.affectedRows > 0
      ? "Discussão atualizada com sucesso."
      : "Nenhuma discussão foi alterada.";
  }

  // Deletar discussão
  async deleteDiscussao(id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      "DELETE FROM Discussoes WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  }

  // Deletar discussão por postagem_id
  async deleteDiscussaoByPostagemId(postagem_id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      "DELETE FROM Discussoes WHERE postagem_id = ?",
      [postagem_id]
    );

    return result.affectedRows > 0;
  }
}

module.exports = DiscussaoRepository;
