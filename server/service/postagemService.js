const DatabaseConnection = require("../db/databaseConnection.js");
const Postagem = require("../models/postagem.js");
const BucketConnection = require("../db/bucketConnection.js");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
class PostagemRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
    this.bucketConnection = new BucketConnection();
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

    const newPostagem = new Postagem(
      result.insertId,
      postagem.titulo,
      postagem.tipoPostagem,
      postagem.autorId,
      postagem.categoriaId,
      postagem.certificacaoId,
      new Date()
    );
    console.log("result -> " + result.insertId);
    return newPostagem;
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
  async getSignedUrlForConteudo(conteudoUrl) {
    if (!conteudoUrl) return null; // Retorna null se o URL for nulo

    try {
      // Conecte-se ao S3
      const bucketConnection = await this.bucketConnection.connect();
      const { bucketName } = this.bucketConnection.config; // Nome do bucket do S3
      const key = conteudoUrl; // URL do conteúdo

      // Configura o comando para obter o signed URL
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key, // Nome da chave do arquivo no S3
      });

      // Gerando o signed URL que permite acessar a imagem privada
      const signedUrl = await getSignedUrl(bucketConnection, command, {
        expiresIn: 3600, // URL válida por 1 hora
      });

      return signedUrl;
    } catch (error) {
      console.error("Erro ao gerar o signed URL do conteúdo:", error);
      return null; // Retorna null em caso de erro
    }
  }

  // Obter todos os detalhes das postagens
  async getPostagensWithAllDetails() {
    const connection = await this.dbConnection.connect();

    const [rows] = await connection.execute(`
      SELECT 
        p.id AS postagem_id,
        p.titulo AS postagem_titulo,
        p.tipo_postagem AS postagem_tipo,
        p.data_publicacao AS postagem_data_publicacao,

        u.id AS usuario_id,
        u.usuario AS usuario_nome,
        u.email AS usuario_email,
        u.imagem AS usuario_imagem,
        u.tipo AS usuario_tipo,
        u.data_criacao AS usuario_data_criacao,

        c.id AS categoria_id,
        c.nome AS categoria_nome,
        c.descricao AS categoria_descricao,
        c.imagem AS categoria_imagem,

        cert.id AS certificacao_id,
        cert.nome AS certificacao_nome,
        cert.descricao AS certificacao_descricao,
        cert.nivel AS certificacao_nivel,

        ct.id AS conteudo_id,
        ct.tipo_conteudo AS conteudo_tipo,
        ct.url AS conteudo_url,
        ct.descricao AS conteudo_descricao,

        d.id AS discussao_id,
        d.tipo_discussao AS discussao_tipo,
        d.texto AS discussao_texto

      FROM 
        Postagens p
      LEFT JOIN 
        Usuarios u ON p.autor_id = u.id
      LEFT JOIN 
        Categorias c ON p.categoria_id = c.id
      LEFT JOIN 
        Certificacoes cert ON p.certificacao_id = cert.id
      LEFT JOIN 
        Conteudos ct ON p.id = ct.postagem_id
      LEFT JOIN 
        Discussoes d ON p.id = d.postagem_id
    `);

    const postagensComSignedUrls = await Promise.all(
      rows.map(async (postagem) => {
        // Se for um tipo de postagem com conteúdo e o URL não for nulo
        if (postagem.conteudo_tipo && postagem.conteudo_url) {
          const signedUrl = await this.getSignedUrlForConteudo(
            postagem.conteudo_url
          );

          if (signedUrl) {
            postagem.conteudo_url = signedUrl; // Atualiza o URL do conteúdo com o signed URL
          }
        }
        return postagem;
      })
    );

    return postagensComSignedUrls;
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
