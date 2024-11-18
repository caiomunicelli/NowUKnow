const mysql = require("mysql2/promise");
const DatabaseConnection = require("../providers/databaseConnection.js");
const PostagemRepository = require("../service/postagemService.js");
const UserRepository = require("../service/usuarioService.js");
const S3Provider = require("../providers/s3Provider");

const userRepository = new UserRepository();
const postagemRepository = new PostagemRepository();
class ConteudoRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
    this.S3Provider = new S3Provider();
  }

  async createConteudo(conteudo) {
    console.log("Conteudo: ", conteudo);
    const connection = await this.dbConnection.connect();
    let urlArquivo = null;
    // Upload para o S3, se houver um arquivo de conteúdo
    if (conteudo.arquivo) {
      try {
        await this.S3Provider.connect();
        const postagem = await postagemRepository.getPostagemById(
          conteudo.postagem_id
        );
        const autor = await userRepository.getUserById(postagem.autor_id);
        urlArquivo = await this.S3Provider.uploadFile(
          "conteudos",
          autor.usuario,
          conteudo.arquivo,
          `_${conteudo.postagem_id}`
        );
      } catch (error) {
        console.error("Erro ao enviar arquivo para o S3:", error);
        throw new Error("Falha no upload do arquivo");
      }
    }

    const [result] = await connection.execute(
      `INSERT INTO Conteudos (postagem_id, tipo_conteudo, url, descricao) VALUES (?, ?, ?, ?)`,
      [
        conteudo.postagem_id,
        conteudo.tipo_conteudo,
        urlArquivo || null,
        conteudo.descricao || null,
      ]
    );

    return {
      id: result.insertId,
      postagem_id: conteudo.postagem_id,
      tipo_conteudo: conteudo.tipo_conteudo,
      url: urlArquivo || null,
      descricao: conteudo.descricao,
    };
  }
  async getAllConteudos() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Conteudos");
    return rows;
  }

  async getConteudoById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Conteudos WHERE id = ?",
      [id]
    );

    const conteudo = rows[0];
    return conteudoconteudo;
  }

  async updateConteudo(conteudo) {
    const connection = await this.dbConnection.connect();
    let urlArquivo = conteudo.url || null;

    // Se o conteúdo tiver um novo arquivo, excluir o arquivo anterior
    if (conteudo.arquivo) {
      const conteudoExistente = await this.getConteudoById(conteudo.id);

      // Excluir o arquivo anterior do S3, se existir
      if (conteudoExistente && conteudoExistente.url) {
        try {
          await this.S3Provider.connect();
          await this.S3Provider.deleteFile(conteudoExistente.url); // Exclui o arquivo antigo
        } catch (error) {
          console.error("Erro ao excluir arquivo anterior:", error);
        }
      }

      // Carregar o novo arquivo para o S3
      try {
        await this.S3Provider.connect();
        const postagem = await postagemRepository.getPostagemById(
          conteudo.postagem_id
        );
        const autor = await userRepository.getUserById(postagem.autor_id);
        urlArquivo = await this.S3Provider.uploadFile(
          "conteudos",
          autor.usuario,
          conteudo.arquivo,
          `_${conteudo.postagem_id}`
        );
      } catch (error) {
        console.error("Erro ao enviar novo arquivo para o S3:", error);
        throw new Error("Falha no upload do arquivo");
      }
    }

    const [result] = await connection.execute(
      `UPDATE Conteudos SET postagem_id = ?, tipo_conteudo = ?, url = ?, descricao = ? WHERE id = ?`,
      [
        conteudo.postagem_id,
        conteudo.tipo_conteudo,
        urlArquivo || null,
        conteudo.descricao || null,
        conteudo.id,
      ]
    );

    return result.affectedRows > 0
      ? "Conteúdo atualizado com sucesso."
      : "Nenhum conteúdo foi alterado.";
  }
  async deleteConteudo(id) {
    const connection = await this.dbConnection.connect();

    // Verifica se o conteúdo tem um arquivo associado
    const conteudoExistente = await this.getConteudoById(id);
    if (conteudoExistente && conteudoExistente.url) {
      // Excluir o arquivo do S3
      try {
        await this.S3Provider.connect();
        await this.S3Provider.deleteFile(conteudoExistente.url);
      } catch (error) {
        console.error("Erro ao excluir arquivo do S3:", error);
      }
    }

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

    return rows;
  }
}

module.exports = ConteudoRepository;
