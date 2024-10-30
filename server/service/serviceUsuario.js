const sql = require('mssql');
const DatabaseConnection = require('../db/databaseConnection.js');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.js')

class UserRepository {
    constructor() {
        this.dbConnection = new DatabaseConnection();
    }

    async createUser(usuario) {
        console.log("Criando usuário")
        const pool = await this.dbConnection.connect();
        const hashedPassword = await bcrypt.hash(usuario.senha, 10);
        const result = await pool.request()
            .input('nome', sql.VarChar,  usuario.nome)
            .input('email', sql.VarChar, usuario.email)
            .input('senha', sql.VarChar, hashedPassword)
            .input('tipo', sql.VarChar,  usuario.tipo)
            .query(`INSERT INTO dbo.Usuarios (nome, email, senha, tipo) OUTPUT INSERTED.* VALUES (@nome, @email, @senha, @tipo)`);
        console.log("Usuário criado")
        return result.recordset[0]; // Retorna o usuário criado
    }

    async getAllUsers() {
        const pool = await this.dbConnection.connect();
        const result = await pool.request().query('SELECT * FROM dbo.Usuarios');
        
        return result.recordset; // Retorna todos os usuários
    }

    async getUserById(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM dbo.Usuarios WHERE Id = @id');
        
        return result.recordset[0]; // Retorna o usuário encontrado ou undefined
    }

    async getUserByEmail(email) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM dbo.Usuarios WHERE Email = @email');
        
        return result.recordset[0]; // Retorna o usuário encontrado ou undefined
    }

    async updateUser(usuario) {
        const pool = await this.dbConnection.connect();
        const hashedPassword = await bcrypt.hash(usuario.senha, 10);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nome', sql.VarChar,  usuario.nome)
            .input('email', sql.VarChar, usuario.email)
            .input('senha', sql.VarChar, hashedPassword)
            .input('tipo', sql.VarChar,  usuario.tipo)
            .query(`UPDATE dbo.Usuarios SET nome = @nome, email = @email, senha = COALESCE(@senha, senha), tipo = @tipo WHERE Id = @id`);
        
        return result.rowsAffected[0] > 0; // Retorna true se a atualização foi bem-sucedida
    }

    async deleteUser(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM dbo.Usuarios WHERE Id = @id');
        
        return result.rowsAffected[0] > 0; // Retorna true se o usuário foi deletado
    }
}

module.exports = UserRepository;
