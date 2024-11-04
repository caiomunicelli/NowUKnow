const sql = require('mssql');
const DatabaseConnection = require('../db/databaseConnection.js');
const Discussao = require('../models/discussao.js');

class DiscussaoRepository {
    constructor() {
        this.dbConnection = new DatabaseConnection();
    }

    async createDiscussao(discussao) {
        console.log("Criando discussão");
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('usuario_id', sql.Int, discussao.usuarioId)
            .input('conteudo_id', sql.Int, discussao.conteudoId)
            .input('pergunta', sql.Text, discussao.pergunta)
            .query(`INSERT INTO dbo.Discussao (usuario_id, conteudo_id, pergunta) OUTPUT INSERTED.* VALUES (@usuario_id, @conteudo_id, @pergunta)`);
        console.log("Discussão criada");
        return result.recordset[0]; // Retorna a discussão criada
    }

    async getAllDiscussoes() {
        const pool = await this.dbConnection.connect();
        const result = await pool.request().query('SELECT * FROM dbo.Discussao');
        
        return result.recordset; // Retorna todas as discussões
    }

    async getDiscussaoById(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM dbo.Discussao WHERE Id = @id');
        
        return result.recordset[0]; // Retorna a discussão encontrada ou undefined
    }

    async updateDiscussao(discussao) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, discussao.id)
            .input('usuario_id', sql.Int, discussao.usuarioId)
            .input('conteudo_id', sql.Int, discussao.conteudoId)
            .input('pergunta', sql.Text, discussao.pergunta)
            .query(`UPDATE dbo.Discussao SET usuario_id = @usuario_id, conteudo_id = @conteudo_id, pergunta = @pergunta WHERE Id = @id`);
        
        return result.rowsAffected[0] > 0; // Retorna true se a atualização foi bem-sucedida
    }

    async deleteDiscussao(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM dbo.Discussao WHERE Id = @id');
        
        return result.rowsAffected[0] > 0; // Retorna true se a discussão foi deletada
    }
}

module.exports = DiscussaoRepository;
