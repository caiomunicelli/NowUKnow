const mysql = require("mysql2/promise");
const DatabaseConnection = require("../db/databaseConnection.js");

class ConteudoRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  async createConteudo(conteudo) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `INSERT INTO Conteudos (postagem_id, tipo_conteudo, url, descricao) VALUES (?, ?, ?, ?)`,
      [
        conteudo.postagem_id,
        conteudo.tipo_conteudo,
        conteudo.url,
        conteudo.descricao || null, // Descrição é opcional
      ]
    );

    // Retorna o conteúdo criado com o ID gerado
    return {
      id: result.insertId,
      ...conteudo,
    };
  }

  async getAllConteudos() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Conteudos");

    return rows; // Retorna todos os conteúdos
  }

  async getConteudoById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Conteudos WHERE id = ?",
      [id]
    );

    return rows[0]; // Retorna o conteúdo encontrado ou undefined
  }

  async updateConteudo(conteudo) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `UPDATE Conteudos SET postagem_id = ?, tipo_conteudo = ?, url = ?, descricao = ? WHERE id = ?`,
      [
        conteudo.postagem_id,
        conteudo.tipo_conteudo,
        conteudo.url,
        conteudo.descricao || null, // Descrição é opcional
        conteudo.id,
      ]
    );

    return result.affectedRows > 0
      ? "Conteúdo atualizado com sucesso."
      : "Nenhum conteúdo foi alterado.";
  }

  async deleteConteudo(id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      "DELETE FROM Conteudos WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0; // Retorna true se o conteúdo foi deletado
  }

  async getConteudosComAutor() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(`
            SELECT 
                c.id AS conteudo_id,
                c.tipo_conteudo,
                c.url,
                c.descricao,
                p.id AS postagem_id,
                p.titulo AS postagem_titulo
            FROM Conteudos c
            INNER JOIN Postagens p ON c.postagem_id = p.id
        `);

    return rows; // Retorna a lista de conteúdos com informações da postagem
  }
}

module.exports = ConteudoRepository;
