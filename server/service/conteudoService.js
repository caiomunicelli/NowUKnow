const mysql = require("mysql2/promise");
const DatabaseConnection = require("../db/databaseConnection.js");

class ConteudoRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  async createConteudo(conteudo) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `INSERT INTO Conteudos (titulo, descricao, tipo_conteudo, autor_id, nivel_dificuldade, duracao, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        conteudo.titulo,
        conteudo.descricao,
        conteudo.tipo_conteudo,
        conteudo.autor_id,
        conteudo.nivel_dificuldade,
        conteudo.duracao,
        conteudo.categoria,
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
      `UPDATE Conteudos SET titulo = ?, descricao = ?, tipo_conteudo = ?, autor_id = ?, nivel_dificuldade = ?, duracao = ?, categoria = ? WHERE id = ?`,
      [
        conteudo.titulo,
        conteudo.descricao,
        conteudo.tipo_conteudo,
        conteudo.autor_id,
        conteudo.nivel_dificuldade,
        conteudo.duracao,
        conteudo.categoria,
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
                c.titulo,
                c.descricao,
                c.tipo_conteudo,
                c.nivel_dificuldade,
                c.duracao,
                c.categoria,
                c.data_upload,
                u.id AS autor_id,
                u.nome AS autor_nome,
                u.email AS autor_email
            FROM Conteudos c
            INNER JOIN Usuarios u ON c.autor_id = u.id
        `);

    return rows; // Retorna a lista de conteúdos com informações do autor
  }
}

module.exports = ConteudoRepository;
