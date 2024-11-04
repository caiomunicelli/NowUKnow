const sql = require('mssql');
const DatabaseConnection = require('../db/databaseConnection.js');

class ConteudoRepository {
    constructor() {
        this.dbConnection = new DatabaseConnection();
    }

    async createConteudo(conteudo) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('titulo', sql.VarChar, conteudo.titulo)
            .input('descricao', sql.Text, conteudo.descricao)
            .input('tipo_conteudo', sql.VarChar, conteudo.tipo_conteudo)
            .input('autor_id', sql.Int, conteudo.autor_id)
            .input('nivel_dificuldade', sql.VarChar, conteudo.nivel_dificuldade)
            .input('duracao', sql.Int, conteudo.duracao)
            .input('categoria', sql.VarChar, conteudo.categoria)
            .query(`INSERT INTO dbo.Conteudos (titulo, descricao, tipo_conteudo, autor_id, nivel_dificuldade, duracao, categoria) OUTPUT INSERTED.* 
                    VALUES (@titulo, @descricao, @tipo_conteudo, @autor_id, @nivel_dificuldade, @duracao, @categoria)`);
        
        return result.recordset[0]; // Retorna o conteúdo criado
    }

    async getAllConteudos() {
        const pool = await this.dbConnection.connect();
        const result = await pool.request().query('SELECT * FROM dbo.Conteudos');
        
        return result.recordset; // Retorna todos os conteúdos
    }

    async getConteudoById(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM dbo.Conteudos WHERE Id = @id');
        
        return result.recordset[0]; // Retorna o conteúdo encontrado ou undefined
    }

    async updateConteudo(conteudo) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, conteudo.id)
            .input('titulo', sql.VarChar, conteudo.titulo)
            .input('descricao', sql.Text, conteudo.descricao)
            .input('tipo_conteudo', sql.VarChar, conteudo.tipo_conteudo)
            .input('autor_id', sql.Int, conteudo.autor_id)
            .input('nivel_dificuldade', sql.VarChar, conteudo.nivel_dificuldade)
            .input('duracao', sql.Int, conteudo.duracao)
            .input('categoria', sql.VarChar, conteudo.categoria)
            .query(`UPDATE dbo.Conteudos 
                    SET titulo = @titulo, descricao = @descricao, tipo_conteudo = @tipo_conteudo, 
                        autor_id = @autor_id, nivel_dificuldade = @nivel_dificuldade, duracao = @duracao, 
                        categoria = @categoria 
                    WHERE Id = @id`);
        
        return result.rowsAffected[0] > 0 ? "Conteúdo atualizado com sucesso." : "Nenhum conteúdo foi alterado.";
    }

    async deleteConteudo(id) {
        const pool = await this.dbConnection.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM dbo.Conteudos WHERE Id = @id');
        
        return result.rowsAffected[0] > 0; // Retorna true se o conteúdo foi deletado
    }

    async getConteudosComAutor() {
        const pool = await this.dbConnection.connect();
        const result = await pool.request().query(`
            SELECT 
                c.id AS conteudo_id,
                c.titulo,
                c.descricao,
                c.tipo_conteudo,
                c.nivel_dificuldade,
                c.duracao,
                c.categoria,
                c.data_upload,
                u.id AS autor_id,
                u.nome AS autor_nome,
                u.email AS autor_email
            FROM dbo.Conteudos c
            INNER JOIN dbo.Usuarios u ON c.autor_id = u.id
        `);
        
        return result.recordset; // Retorna a lista de conteúdos com informações do autor
    }
}

module.exports = ConteudoRepository;
