const DatabaseConnection = require("../db/databaseConnection.js");
const Postagem = require("../models/postagem.js");

class PostagemRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  // Criar uma nova postagem
  async createPostagem(postagem) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `INSERT INTO Postagens (titulo, tipo_postagem, autor_id, categoria_id, certificacao_id) VALUES (?, ?, ?, ?, ?)`,
      [postagem.titulo, postagem.tipoPostagem, postagem.autorId, postagem.categoriaId, postagem.certificacaoId]
    );

    return {
        id: result.insertId,
        ...postagem,
      };
  }

  // Obter todas as postagens
  async getAllPostagens() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Postagens");
    return rows;
  }

  // Obter uma postagem por ID
  async getPostagemById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Postagens WHERE id = ?",
      [id]
    );
    return rows[0]; // Retorna a postagem encontrada ou undefined
  }

  // Atualizar uma postagem por ID
  async updatePostagem(postagem) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `UPDATE Postagens SET titulo = ?, tipo_postagem = ?, categoria_id = ?, certificacao_id = ? WHERE id = ?`,
      [postagem.titulo, postagem.tipoPostagem, postagem.categoriaId, postagem.certificacaoId, postagem.id]
    );

    return result.affectedRows > 0
      ? "Postagem atualizada com sucesso."
      : "Nenhuma postagem foi alterada.";
  }

  // Excluir uma postagem por ID
  async deletePostagem(id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      "DELETE FROM Postagens WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0; // Retorna true se a postagem foi excluída
  }
}

module.exports = PostagemRepository;
