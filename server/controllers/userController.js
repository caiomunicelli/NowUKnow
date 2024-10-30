const sql = require('mssql');
// const DatabaseConnection = path.join(__dirname, '../bd/databaseConnection.js/')
// const DatabaseConnection = require('./NowUKnow/server/config/databaseConfig.js');
// DatabaseConfig.js
// const sql = require('mssql');
class DatabaseConfig {
    constructor() {
        this.config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            database: process.env.DB_NAME,
        };
    }

    getConfig() {
        return this.config;
    }
}

class DatabaseConnection {
    constructor() {
        this.config = new DatabaseConfig().getConfig();
        this.pool = null;
    }

    async connect() {
        try {
            if (!this.pool) {
                this.pool = await sql.connect(this.config);
                console.log("Conexão bem-sucedida!");
            }
            return this.pool;
        } catch (err) {
            console.error("Erro na conexão:", err);
            throw err;
        }
    }

    async close() {
        if (this.pool) {
            await this.pool.close();
            this.pool = null;
            console.log("Conexão encerrada!");
        }
    }
}

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
            .query(`INSERT INTO dbo.Usuarios (nome, email, senha, tipo) OUTPUT INSERTED.* VALUES (@nome, @email, @senha, @tipo)`);
        
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

    async updateUser(id, nome, email, senha, tipo) {
        const pool = await this.dbConnection.connect();
        const hashedPassword = senha ? senha : undefined;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nome', sql.VarChar, nome)
            .input('email', sql.VarChar, email)
            .input('senha', sql.VarChar, hashedPassword)
            .input('tipo', sql.VarChar, tipo)
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
