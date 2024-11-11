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
      [
        postagem.titulo,
        postagem.tipoPostagem,
        postagem.autorId,
        postagem.categoriaId,
        postagem.certificacaoId,
      ]
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
    return rows[0];
  }

  async getPostagemByTitulo(titulo) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Postagens WHERE titulo LIKE ?",
      [`%${titulo}%`]
    );

    return rows.map(
      (row) =>
        new Postagem(
          row.id,
          row.titulo,
          row.tipo_postagem,
          row.autor_id,
          row.categoria_id,
          row.certificacao_id
        )
    );
  }

  // Obter todas as postagens de uma categoria por categoria_id
  async getPostagensByCategoriaId(categoriaId) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Postagens WHERE categoria_id = ?",
      [categoriaId]
    );
    return rows;
  }

  // Obter todas as postagens por certificacao_id
  async getPostagensByCertificacaoId(certificacaoId) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Postagens WHERE certificacao_id = ?",
      [certificacaoId]
    );
    return rows;
  }

  // Obter todas as postagens por autor_id
  async getPostagensByAutorId(autorId) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Postagens WHERE autor_id = ?",
      [autorId]
    );
    return rows;
  }

  // Atualizar uma postagem por ID
  async updatePostagem(postagem) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `UPDATE Postagens SET titulo = ?, tipo_postagem = ?, categoria_id = ?, certificacao_id = ? WHERE id = ?`,
      [
        postagem.titulo,
        postagem.tipoPostagem,
        postagem.categoriaId,
        postagem.certificacaoId,
        postagem.id,
      ]
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

    return result.affectedRows > 0;
  }
}

module.exports = PostagemRepository;
