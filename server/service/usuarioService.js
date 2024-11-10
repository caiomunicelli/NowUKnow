const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const DatabaseConnection = require("../db/databaseConnection.js");
const BucketConnection = require("../db/bucketConnection.js");
const Usuario = require("../models/usuario.js");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

class UserRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
    this.bucketConnection = new BucketConnection();
  }

  async getUserWithImageUrl(user) {
    // Verifica se o usuário tem uma imagem associada
    if (user.imagem) {
      console.log(user.imagem);
      try {
        // Conecte-se ao S3
        const bucketConnection = await this.bucketConnection.connect(); // Substitua pela sua região
        const { bucketName } = this.bucketConnection.config; // Nome do bucket do S3
        const key = user.imagem;
        // Configura os parâmetros para obter a URL assinada
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: key, // Nome da chave do arquivo no S3
        });

        // Gerando o signed URL que permite acessar a imagem privada
        const signedUrl = await getSignedUrl(bucketConnection, command, {
          expiresIn: 3600,
        }); // URL válida por 1 hora

        // Atualizando a propriedade 'imagem' no usuário com a URL assinada
        user.imagem = signedUrl;
      } catch (error) {
        console.error("Erro ao gerar o signed URL da imagem:", error);
      }
    }
    return user;
  }

  async createUser(usuario) {
    console.log("Criando usuário");
    const connection = await this.dbConnection.connect();

    const hashedPassword = await bcrypt.hash(usuario.senha, 10);

    // Assumindo que `this.bucketConnection` seja uma instância do cliente S3
    let nomeImagem = null;
    if (usuario.imagem) {
      try {
        const bucketConnection = await this.bucketConnection.connect(); // Conecta ao S3

        // Define o nome do bucket e a chave (nome do arquivo)
        const { bucketName } = this.bucketConnection.config; // Nome do seu bucket
        nomeImagem = `usuarios/${Date.now()}_${usuario.usuario}`; // Nome único baseado no usuário e timestamp

        const uploadParams = {
          Bucket: bucketName,
          Key: nomeImagem, // Nome do arquivo no S3
          Body: usuario.imagem.buffer, // Conteúdo do arquivo, armazenado em memória
          ContentType: usuario.imagem.mimetype, // Tipo MIME do arquivo
        };

        // Envia o arquivo para o S3
        const command = new PutObjectCommand(uploadParams);
        const data = await bucketConnection.send(command);

        // Salva a URL da imagem no objeto do usuário
        console.log(`Upload bem-sucedido: ${data.Location}`);
      } catch (error) {
        console.error("Erro ao enviar imagem para o S3:", error);
        throw new Error("Falha no upload da imagem");
      }
    }

    const [result] = await connection.execute(
      `INSERT INTO Usuarios (usuario, nome, email, senha, imagem, tipo) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuario.usuario,
        usuario.nome,
        usuario.email,
        hashedPassword,
        nomeImagem || null,
        usuario.tipo || "Basico",
      ]
    );

    const newUser = {
      id: result.insertId,
      usuario: usuario.usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo || "Basico",
      imagem: nomeImagem || null,
      data_criacao: new Date(), // Considerando a data atual como data_criacao
    };

    console.log("Usuário criado");
    return newUser;
  }

  async getAllUsers() {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute("SELECT * FROM Usuarios");
    const usersWithImages = await Promise.all(
      rows.map(async (user) => await this.getUserWithImageUrl(user))
    );
    return usersWithImages; // Retorna todos os usuários com URL da imagem, se existir
  }

  async getUserById(id) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Usuarios WHERE id = ?",
      [id]
    );
    const user = rows[0]; // Retorna o usuário encontrado ou undefined
    return user ? await this.getUserWithImageUrl(user) : null; // Chama o método para pegar a URL da imagem
  }

  async getUserByEmail(email) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Usuarios WHERE email = ?",
      [email]
    );
    const user = rows[0]; // Retorna o usuário encontrado ou undefined
    return user ? await this.getUserWithImageUrl(user) : null; // Chama o método para pegar a URL da imagem
  }

  async getUserByUsername(username) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Usuarios WHERE usuario = ?",
      [username]
    );
    const user = rows[0]; // Retorna o usuário encontrado ou undefined
    return user ? await this.getUserWithImageUrl(user) : null; // Chama o método para pegar a URL da imagem
  }

  async updateUser(usuario) {
    const connection = await this.dbConnection.connect();
    const hashedPassword = usuario.senha
      ? await bcrypt.hash(usuario.senha, 10)
      : null;

    const [result] = await connection.execute(
      `UPDATE Usuarios SET usuario = ?, nome = ?, email = ?, senha = COALESCE(?, senha), imagem = ?, tipo = ? WHERE id = ?`,
      [
        usuario.usuario,
        usuario.nome,
        usuario.email,
        hashedPassword,
        usuario.imagem || null,
        usuario.tipo || "Basico",
        usuario.id,
      ]
    );

    return result.affectedRows > 0
      ? "Usuário alterado com sucesso."
      : "Nenhum usuário alterado.";
  }

  async deleteUser(id) {
    const connection = await this.dbConnection.connect();
    const [result] = await connection.execute(
      "DELETE FROM Usuarios WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0; // Retorna true se o usuário foi deletado
  }
}

module.exports = UserRepository;
