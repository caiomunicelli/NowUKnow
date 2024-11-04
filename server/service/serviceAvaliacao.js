const sql = require('mssql');
const DatabaseConnection = require('../db/databaseConnection.js');
const Avaliacao = require('../models/avaliacao.js');

class AvaliacaoRepository {
    constructor() {
        this.dbConnection = new DatabaseConnection();
    }

    async createAvaliacao(avaliacao) {
        console.log("Criando avaliação");
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('usuario_id', sql.Int, avaliacao.usuario_id)
            .input('conteudo_id', sql.Int, avaliacao.conteudo_id)
            .input('nota', sql.Int, avaliacao.nota)
            .input('comentario', sql.Text, avaliacao.comentario)
            .query('INSERT INTO dbo.Avaliacoes (usuario_id, conteudo_id, nota, comentario) OUTPUT INSERTED.* VALUES (@usuario_id, @conteudo_id, @nota, @comentario)');
        
        console.log("Avaliação criada");
        return result.recordset[0]; // Retorna a avaliação criada
    }

    async getAllAvaliacoes() {
        const pool = await this.dbConnection.connect();
        const result = await pool.request().query('SELECT * FROM dbo.Avaliacoes');
        
        return result.recordset; // Retorna todas as avaliações
    }

    async getAvaliacaoById(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM dbo.Avaliacoes WHERE Id = @id');
        
        return result.recordset[0]; // Retorna a avaliação encontrada ou undefined
    }

    async updateAvaliacao(avaliacao) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, avaliacao.id)
            .input('usuario_id', sql.Int, avaliacao.usuario_id)
            .input('conteudo_id', sql.Int, avaliacao.conteudo_id)
            .input('nota', sql.Int, avaliacao.nota)
            .input('comentario', sql.Text, avaliacao.comentario)
            .query('UPDATE dbo.Avaliacoes SET usuario_id = @usuario_id, conteudo_id = @conteudo_id, nota = @nota, comentario = @comentario WHERE Id = @id');
        
        return result.rowsAffected[0] > 0; // Retorna true se a atualização foi bem-sucedida
    }

    async deleteAvaliacao(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM dbo.Avaliacoes WHERE Id = @id');
        
        return result.rowsAffected[0] > 0; // Retorna true se a avaliação foi deletada
    }
}

module.exports = AvaliacaoRepository;
