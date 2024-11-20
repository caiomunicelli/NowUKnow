const DatabaseConnection = require("../providers/databaseConnection.js");
const Certificacao = require("../entities/certificacao.js");

class CertificacaoRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
  }

  // Criar uma nova certificação
  async createCertificacao(certificacao) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `INSERT INTO Certificacoes (nome, descricao, requisitos, imagem, categoria_id, nivel) 
             VALUES (?, ?, ?, ?, ?, ?)`,
      [
        certificacao.nome,
        certificacao.descricao,
        certificacao.requisitos,
        certificacao.imagem,
        certificacao.categoriaId,
        certificacao.nivel,
      ]
    );

    return new Certificacao(
      result.insertId,
      certificacao.nome,
      certificacao.descricao,
      certificacao.requisitos,
      certificacao.imagem,
      certificacao.categoriaId,
      certificacao.nivel,
      new Date() // Data de criação no momento da inserção
    );
  }

  // Listar todas as certificações
  async getAllCertificacoes() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Certificacoes");

    return rows.map(
      (row) =>
        new Certificacao(
          row.id,
          row.nome,
          row.descricao,
          row.requisitos,
          row.imagem,
          row.categoria_id,
          row.nivel,
          row.data_criacao
        )
    );
  }

  async getAllCertificacoesByCategoriaId(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Certificacoes WHERE categoria_id = ?", [id]);

    return rows.map(
      (row) =>
        new Certificacao(
          row.id,
          row.nome,
          row.descricao,
          row.requisitos,
          row.imagem,
          row.categoria_id,
          row.nivel,
          row.data_criacao
        )
    );
  }

  // Buscar certificação por ID
  async getCertificacaoById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Certificacoes WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Certificacao(
      row.id,
      row.nome,
      row.descricao,
      row.requisitos,
      row.imagem,
      row.categoria_id,
      row.nivel,
      row.data_criacao
    );
  }

  // Atualizar uma certificação por ID
  async updateCertificacao(certificacao) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      `UPDATE Certificacoes SET nome = ?, descricao = ?, requisitos = ?, imagem = ?, 
             categoria_id = ?, nivel = ? WHERE id = ?`,
      [
        certificacao.nome,
        certificacao.descricao,
        certificacao.requisitos,
        certificacao.imagem,
        certificacao.categoriaId,
        certificacao.nivel,
        certificacao.id,
      ]
    );

    return result.affectedRows > 0
      ? "Certificação atualizada com sucesso."
      : "Nenhuma certificação foi alterada.";
  }

  // Deletar uma certificação por ID
  async deleteCertificacao(id) {
    const connection = await this.dbConnection.connect();

    const [result] = await connection.execute(
      "DELETE FROM Certificacoes WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0; // Retorna true se a certificação foi deletada
  }
}

module.exports = CertificacaoRepository;
