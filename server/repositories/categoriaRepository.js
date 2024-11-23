const DatabaseConnection = require("../providers/databaseConnection.js");
const Categoria = require("../entities/categoria.js");
const S3Provider = require("../providers/s3Provider.js");

class CategoriaRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
    this.S3Provider = new S3Provider();
  }

  // Criar uma nova categoria
  async createCategoria(categoria) {
    console.log("Criando categoria");
    const connection = await this.dbConnection.connect();

    let urlImagem = null;

    if (categoria.imagem) {
      try {
        await this.S3Provider.connect();
        urlImagem = await this.S3Provider.uploadFile(
          "categorias",
          categoria.nome,
          categoria.imagem
        );
      } catch (error) {
        console.error("Erro ao enviar imagem para o S3:", error);
        throw new Error("Falha no upload da imagem");
      }
    }

    const [result] = await connection.execute(
      `INSERT INTO Categorias (nome, descricao, imagem) VALUES (?, ?, ?)`,
      [categoria.nome, categoria.descricao, urlImagem || null]
    );

    const newCategoria = new Categoria(
      result.insertId,
      categoria.nome,
      categoria.descricao,
      urlImagem || null,
      new Date()
    );

    console.log("Categoria criada");
    return newCategoria;
  }

  // Listar todas as categorias
  async getAllCategorias() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Categorias");

    return rows.map(
      (row) =>
        new Categoria(
          row.id,
          row.nome,
          row.descricao,
          row.imagem,
          row.data_criacao
        )
    );
  }
  async queryCategoria(query) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Categorias WHERE nome LIKE ?", [`%${query}%`]);
    return rows.map(
      (row) =>
        new Categoria(
          row.id,
          row.nome,
          row.descricao,
          row.imagem,
          row.data_criacao
        )
    );
  }
  // Buscar categoria por ID
  async getCategoriaById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Categorias WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;
    const row = rows[0];
    return new Categoria(
      row.id,
      row.nome,
      row.descricao,
      row.imagem,
      row.data_criacao
    );
  }

  // Buscar categorias por nome
  async getCategoriaByName(nome) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Categorias WHERE nome LIKE ?",
      [`%${nome}%`] // O operador LIKE permite busca parcial
    );

    return rows.map(
      (row) =>
        new Categoria(
          row.id,
          row.nome,
          row.descricao,
          row.imagem,
          row.data_criacao
        )
    );
  }

  // Atualizar uma categoria
  async updateCategoria(categoria) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `UPDATE Categorias SET nome = ?, descricao = ?, imagem = ? WHERE id = ?`,
      [categoria.nome, categoria.descricao, categoria.imagem, categoria.id]
    );

    return result.affectedRows > 0
      ? "Categoria atualizada com sucesso."
      : "Nenhuma categoria alterada.";
  }

  // Deletar uma categoria
  async deleteCategoria(id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      "DELETE FROM Categorias WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0; // Retorna true se a categoria foi deletada
  }
}

module.exports = CategoriaRepository;
