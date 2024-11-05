const sql = require('mssql');
const DatabaseConnection = require('../db/databaseConnection.js');
const Resposta = require('../models/resposta.js');

class RespostaRepository {
    constructor() {
        this.dbConnection = new DatabaseConnection();
    }

    async createResposta(resposta) {
        console.log("Criando resposta");
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('usuario_id', sql.Int, resposta.usuario_id)
            .input('discussao_id', sql.Int, resposta.discussao_id)
            .input('resposta', sql.Text, resposta.resposta)
            .query('INSERT INTO dbo.Respostas (usuario_id, discussao_id, resposta) OUTPUT INSERTED.* VALUES (@usuario_id, @discussao_id, @resposta)');
        console.log("Resposta criada");
        return result.recordset[0]; // Retorna a resposta criada
    }

    async getAllRespostas() {
        const pool = await this.dbConnection.connect();
        const result = await pool.request().query('SELECT * FROM dbo.Respostas');
        
        return result.recordset; // Retorna todas as respostas
    }

    async getRespostaById(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM dbo.Respostas WHERE Id = @id');
        
        return result.recordset[0]; // Retorna a resposta encontrada ou undefined
    }

    async updateResposta(resposta) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, resposta.id)
            .input('usuario_id', sql.Int, resposta.usuario_id)
            .input('discussao_id', sql.Int, resposta.discussao_id)
            .input('resposta', sql.Text, resposta.resposta)
            .query('UPDATE dbo.Respostas SET usuario_id = @usuario_id, discussao_id = @discussao_id, resposta = @resposta WHERE Id = @id');
        
        return result.rowsAffected[0] > 0; // Retorna true se a atualização foi bem-sucedida
    }

    async deleteResposta(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM dbo.Respostas WHERE Id = @id');
        
        return result.rowsAffected[0] > 0; // Retorna true se a resposta foi deletada
    }
}

module.exports = RespostaRepository;
