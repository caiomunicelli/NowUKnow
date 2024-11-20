const DatabaseConnection = require("../providers/databaseConnection.js");
const Comentario = require("../entities/comentario.js");

class ComentarioRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  // Criar um novo comentário
  async createComentario(comentario) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `INSERT INTO Comentarios (postagem_id, usuario_id, texto, parent_id) 
             VALUES (?, ?, ?, ?)`,
      [
        comentario.postagemId,
        comentario.usuarioId,
        comentario.texto,
        comentario.parentId || null,
      ]
    );

    return new Comentario(
      result.insertId,
      comentario.postagemId,
      comentario.usuarioId,
      comentario.texto,
      comentario.parentId,
      new Date() // Data de criação no momento da inserção
    );
  }

  // Buscar todos os comentários
  async getAllComentarios() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Comentarios");

    return rows.map(
      (row) =>
        new Comentario(
          row.id,
          row.postagem_id,
          row.usuario_id,
          row.texto,
          row.parent_id,
          row.data_comentario
        )
    );
  }

  // Buscar comentário por ID
  async getComentarioById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Comentarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Comentario(
      row.id,
      row.postagem_id,
      row.usuario_id,
      row.texto,
      row.parent_id,
      row.data_comentario
    );
  }

  // Atualizar um comentário por ID
  async updateComentario(comentario) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `UPDATE Comentarios SET texto = ? WHERE id = ?`,
      [comentario.texto, comentario.id]
    );

    return result.affectedRows > 0
      ? "Comentário atualizado com sucesso."
      : "Nenhum comentário foi alterado.";
  }

  // Deletar um comentário por ID
  async deleteComentario(id) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      "DELETE FROM Comentarios WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0; // Retorna true se o comentário foi deletado
  }

  // Buscar comentários por postagem
  async getComentariosPorPostagem(postagemId) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Comentarios WHERE postagem_id = ?",
      [postagemId]
    );

    return rows.map(
      (row) =>
        new Comentario(
          row.id,
          row.postagem_id,
          row.usuario_id,
          row.texto,
          row.parent_id,
          row.data_comentario
        )
    );
  }
}

module.exports = ComentarioRepository;
