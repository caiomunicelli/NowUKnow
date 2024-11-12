const mysql = require("mysql2/promise");
const DatabaseConnection = require("../db/databaseConnection.js");
const BucketConnection = require("../db/bucketConnection.js");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

class ConteudoRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
    this.bucketConnection = new BucketConnection();
  }

  async createConteudo(conteudo) {
    console.log("Conteudo: ", conteudo);
    const connection = await this.dbConnection.connect();
    let nomeArquivo = null;
    // Upload para o S3, se houver um arquivo de conteúdo
    if (conteudo.arquivo) {
      try {
        const bucketConnection = await this.bucketConnection.connect();
        const { bucketName } = this.bucketConnection.config;
        nomeArquivo = `conteudos/${Date.now()}_${conteudo.postagem_id}`;

        const uploadParams = {
          Bucket: bucketName,
          Key: nomeArquivo,
          Body: conteudo.arquivo.buffer,
          ContentType: conteudo.arquivo.mimetype,
        };

        const command = new PutObjectCommand(uploadParams);
        await bucketConnection.send(command);
      } catch (error) {
        console.error("Erro ao enviar o arquivo para o S3:", error);
        throw new Error("Falha no upload do arquivo de conteúdo");
      }
    }

    const [result] = await connection.execute(
      `INSERT INTO Conteudos (postagem_id, tipo_conteudo, url, descricao) VALUES (?, ?, ?, ?)`,
      [
        conteudo.postagem_id,
        conteudo.tipo_conteudo,
        nomeArquivo || null,
        conteudo.descricao || null,
      ]
    );

    return {
      id: result.insertId,
      postagem_id: conteudo.postagem_id,
      tipo_conteudo: conteudo.tipo_conteudo,
      url: nomeArquivo || null,
      descricao: conteudo.descricao,
    };
  }

  async getConteudoComSignedUrl(conteudo) {
    console.log(conteudo);
    if (conteudo.url) {
      try {
        const bucketConnection = await this.bucketConnection.connect();
        const { bucketName } = this.bucketConnection.config;
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: conteudo.url,
        });

        const signedUrl = await getSignedUrl(bucketConnection, command, {
          expiresIn: 3600,
        });

        conteudo.url = signedUrl;
      } catch (error) {
        console.error("Erro ao gerar o signed URL do conteúdo:", error);
      }
    }
    console.log("Conteudo com signed", conteudo);
    return conteudo;
  }

  async getAllConteudos() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Conteudos");
    const conteudosWithUrls = await Promise.all(
      rows.map(async (conteudo) => await this.getConteudoComSignedUrl(conteudo))
    );
    return conteudosWithUrls;
  }

  async getConteudoById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Conteudos WHERE id = ?",
      [id]
    );

    const conteudo = rows[0];
    return conteudo ? await this.getConteudoComSignedUrl(conteudo) : null;
  }

  async updateConteudo(conteudo) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      `UPDATE Conteudos SET postagem_id = ?, tipo_conteudo = ?, url = ?, descricao = ? WHERE id = ?`,
      [
        conteudo.postagem_id,
        conteudo.tipo_conteudo,
        conteudo.url || null,
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
    const [result] = await connection.execute(
      "DELETE FROM Conteudos WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
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

    const conteudosWithUrls = await Promise.all(
      rows.map(async (conteudo) => await this.getConteudoComSignedUrl(conteudo))
    );

    return conteudosWithUrls;
  }
}

module.exports = ConteudoRepository;
