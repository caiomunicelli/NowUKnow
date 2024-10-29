const DatabaseConnection = require('./NowUKnow/server/db/databaseConnection.js');
const sql = require('mssql');

class UserRepository {
    constructor() {
        this.dbConnection = new DatabaseConnection();
    }

    async createUser(nome, email, senha, tipo) {
        const pool = await this.dbConnection.connect();
        const hashedPassword = senha;
        const result = await pool.request()
            .input('nome', sql.VarChar, nome)
            .input('email', sql.VarChar, email)
            .input('senha', sql.VarChar, hashedPassword)
            .input('tipo', sql.VarChar, tipo)
            .query(`INSERT INTO Users (nome, email, senha, tipo) OUTPUT INSERTED.* VALUES (@nome, @email, @senha, @tipo)`);
        return result.recordset[0];
    }

    async getAllUsers() {
        const pool = await this.dbConnection.connect();
        const result = await pool.request().query('SELECT * FROM Users');
        return result.recordset;
    }

    async getUserById(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Users WHERE Id = @id');
        return result.recordset[0];
    }

    async updateUser(id, nome, email, senha, tipo) {
        const pool = await this.dbConnection.connect();
        const hashedPassword = senha ? senha : undefined;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nome', sql.VarChar, nome)
            .input('email', sql.VarChar, email)
            .input('senha', sql.VarChar, hashedPassword)
            .input('tipo', sql.VarChar, tipo)
            .query(`UPDATE Users SET nome = @nome, email = @email, senha = COALESCE(@senha, senha), tipo = @tipo WHERE Id = @id`);
        return await this.getUserById(id);
    }

    async deleteUser(id) {
        const pool = await this.dbConnection.connect();
        await pool.request().input('id', sql.Int, id).query('DELETE FROM Users WHERE Id = @id');
    }
}

module.exports = UserRepository;
