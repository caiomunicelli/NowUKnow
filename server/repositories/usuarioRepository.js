const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const DatabaseConnection = require("../providers/databaseConnection.js");
const S3Provider = require("../providers/s3Provider.js");
const PostagemService = require("./postagemRepository.js");

const postagemService = new PostagemService();
class UserRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
    this.S3Provider = new S3Provider();
  }

  async createUser(usuario) {
    console.log("Criando usuário");
    const connection = await this.dbConnection.connect();

    const hashedPassword = await bcrypt.hash(usuario.senha, 10);

    let urlImagem = null;

    if (usuario.imagem) {
      try {
        await this.S3Provider.connect();
        urlImagem = await this.S3Provider.uploadFile(
          "usuarios",
          usuario.usuario,
          usuario.imagem
        );
      } catch (error) {
        console.error("Erro ao enviar imagem para o S3:", error);
        throw new Error("Falha no upload da imagem");
      }
    }

    console.log(urlImagem);
    const [result] = await connection.execute(
      `INSERT INTO Usuarios (usuario, nome, email, senha, imagem, tipo) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuario.usuario,
        usuario.nome,
        usuario.email,
        hashedPassword,
        urlImagem || null,
        usuario.tipo || "Basico",
      ]
    );

    const newUser = {
      id: result.insertId,
      usuario: usuario.usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo || "Basico",
      imagem: urlImagem || null,
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
    return user; // Chama o método para pegar a URL da imagem
  }

  async getUserByEmail(email) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Usuarios WHERE email = ?",
      [email]
    );
    const user = rows[0]; // Retorna o usuário encontrado ou undefined
    return user; // Chama o método para pegar a URL da imagem
  }

  async getUserByUsername(username) {
    const connection = await this.dbConnection.connect();
    const [rows] = await connection.execute(
      "SELECT * FROM Usuarios WHERE usuario = ?",
      [username]
    );
    const user = rows[0]; // Retorna o usuário encontrado ou undefined
    return user; // Chama o método para pegar a URL da imagem
  }

  async updateUser(usuario) {
    const connection = await this.dbConnection.connect();
    const hashedPassword = usuario.senha
      ? await bcrypt.hash(usuario.senha, 10)
      : null;

    let urlImagem = null;

    if (usuario.imagem) {
      const usuarioExistente = await this.getUserById(usuario.id);
      if (usuarioExistente && usuarioExistente.imagem) {
        // Exclui a imagem anterior do S3
        try {
          await this.S3Provider.connect();
          await this.S3Provider.deleteFile(usuarioExistente.imagem);
        } catch (error) {
          console.error("Erro ao excluir imagem anterior:", error);
        }
      }

      try {
        await this.S3Provider.connect();
        urlImagem = await this.S3Provider.uploadFile(
          "usuarios",
          usuario.usuario,
          usuario.imagem
        );
      } catch (error) {
        console.error("Erro ao enviar imagem para o S3:", error);
        throw new Error("Falha no upload da imagem");
      }

      const [result] = await connection.execute(
        `UPDATE Usuarios SET usuario = ?, nome = ?, email = ?, senha = COALESCE(?, senha), imagem = ?, tipo = ? WHERE id = ?`,
        [
          usuario.usuario,
          usuario.nome,
          usuario.email,
          hashedPassword,
          urlImagem || null,
          usuario.tipo || "Basico",
          usuario.id,
        ]
      );
    } else {
      const [result] = await connection.execute(
        `UPDATE Usuarios SET usuario = ?, nome = ?, email = ?, senha = COALESCE(?, senha), tipo = ? WHERE id = ?`,
        [
          usuario.usuario,
          usuario.nome,
          usuario.email,
          hashedPassword,
          usuario.tipo || "Basico",
          usuario.id,
        ]
      );
    }

    return result.affectedRows > 0
      ? "Usuário alterado com sucesso."
      : "Nenhum usuário alterado.";
  }

  async deleteUser(id) {
    const connection = await this.dbConnection.connect();

    // Verifica se o usuário tem uma imagem associada
    const usuarioExistente = await this.getUserById(id);
    if (usuarioExistente && usuarioExistente.imagem) {
      // Exclui a imagem do S3
      try {
        await this.S3Provider.connect();
        await this.S3Provider.deleteFile(usuarioExistente.imagem);
      } catch (error) {
        console.error("Erro ao excluir imagem:", error);
      }
    }

    postagemService.deletePostagensByAutorId(id);

    const [result] = await connection.execute(
      "DELETE FROM Usuarios WHERE id = ?",
      [id]
    );
    console.log(result);
    return result.affectedRows > 0; // Retorna true se o usuário foi deletado
  }
}

module.exports = UserRepository;
