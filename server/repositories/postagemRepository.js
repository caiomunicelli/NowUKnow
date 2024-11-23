const DatabaseConnection = require("../providers/databaseConnection.js");
const Postagem = require("../entities/postagem.js");
const ConteudoRepository = require("./conteudoRepository.js");
const DiscussaoRepository = require("./discussaoRepository.js");

const conteudoRepository = new ConteudoRepository();
const discussaoRepository = new DiscussaoRepository();
class PostagemRepository {
  constructor() {
    this.dbConnection = new DatabaseConnection();
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
      `
      
      SELECT 
        p.id AS postagem_id,
        p.titulo AS postagem_titulo,
        p.tipo_postagem AS postagem_tipo,
        p.data_publicacao AS postagem_data_publicacao,

        u.id AS usuario_id,
        u.nome AS usuario_nome_completo,
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
      

      WHERE p.id = ?`,
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
  async getPostagensWithAllDetails() {
    const connection = await this.dbConnection.connect();

    const [rows] = await connection.execute(`
      SELECT 
        p.id AS postagem_id,
        p.titulo AS postagem_titulo,
        p.tipo_postagem AS postagem_tipo,
        p.data_publicacao AS postagem_data_publicacao,

        u.id AS usuario_id,
        u.nome AS usuario_nome_completo,
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
      ORDER BY 
        p.data_publicacao DESC
    `);

    return rows;
  }

  async getPostagensWithAllDetailsByAutorId(autorId) {
    const connection = await this.dbConnection.connect();

    const [rows] = await connection.execute(
      `
      SELECT 
        p.id AS postagem_id,
        p.titulo AS postagem_titulo,
        p.tipo_postagem AS postagem_tipo,
        p.data_publicacao AS postagem_data_publicacao,

        u.id AS usuario_id,
        u.nome AS usuario_nome_completo,
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
      WHERE
        p.autor_id = ?
      ORDER BY 
        p.data_publicacao DESC
    `,
      [autorId]
    );

    return rows;
  }
  // Obter todas as postagens por certificacao_id
  async getPostagensWithAllDetailsByCategoriaId(categoriaId) {
    const connection = await this.dbConnection.connect();
    try {
      const [rows] = await connection.execute(
        `
        SELECT 
          p.id AS postagem_id,
          p.titulo AS postagem_titulo,
          p.tipo_postagem AS postagem_tipo,
          p.data_publicacao AS postagem_data_publicacao,
  
          u.id AS usuario_id,
          u.nome AS usuario_nome_completo,
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
        INNER JOIN 
          Usuarios u ON p.autor_id = u.id
        INNER JOIN 
          Categorias c ON p.categoria_id = c.id
        LEFT JOIN 
          Certificacoes cert ON p.certificacao_id = cert.id
        LEFT JOIN 
          Conteudos ct ON p.id = ct.postagem_id
        LEFT JOIN 
          Discussoes d ON p.id = d.postagem_id
        WHERE
          p.categoria_id = ?
        ORDER BY 
          p.data_publicacao DESC
      `,
        [categoriaId]
      );
      return rows;
    } catch (error) {
      console.error("Erro ao obter detalhes das postagens:", error);
      throw error;
    }
  }

  async getPostagensWithAllDetailsByUsuarioFeedback(usuarioFeedbackId) {
    const connection = await this.dbConnection.connect();
    try {
      const [rows] = await connection.execute(
        `
      SELECT 
        p.id AS postagem_id,
        p.titulo AS postagem_titulo,
        p.tipo_postagem AS postagem_tipo,
        p.data_publicacao AS postagem_data_publicacao,

        u.id AS usuario_id,
        u.nome AS usuario_nome_completo,
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
        d.texto AS discussao_texto,
        
        a.usuario_id as usuario_feedback,
        a.feedback,
        a.data_avaliacao
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
      LEFT JOIN
      	Avaliacoes a ON p.id = a.postagem_id
      WHERE
        a.feedback = 'positivo'
      AND
        a.usuario_id = ?
      ORDER BY 
        a.data_avaliacao DESC
      `,
        [usuarioFeedbackId]
      );
      return rows;
    } catch (error) {
      console.error("Erro ao obter detalhes das postagens:", error);
      throw error;
    }
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
  // Obter todas as postagens por certificacao_id
  async getPostagensWithAllDetailsByCertificacaoId(certificacaoId) {
    const connection = await this.dbConnection.connect();
    try {
      const [rows] = await connection.execute(
        `
        SELECT 
          p.id AS postagem_id,
          p.titulo AS postagem_titulo,
          p.tipo_postagem AS postagem_tipo,
          p.data_publicacao AS postagem_data_publicacao,
  
          u.id AS usuario_id,
          u.nome AS usuario_nome_completo,
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
        INNER JOIN 
          Usuarios u ON p.autor_id = u.id
        INNER JOIN 
          Categorias c ON p.categoria_id = c.id
        INNER JOIN 
          Certificacoes cert ON p.certificacao_id = cert.id
        LEFT JOIN 
          Conteudos ct ON p.id = ct.postagem_id
        LEFT JOIN 
          Discussoes d ON p.id = d.postagem_id
        WHERE
          p.certificacao_id = ?
        ORDER BY 
          p.data_publicacao DESC
      `,
        [certificacaoId]
      );
      return rows;
    } catch (error) {
      console.error("Erro ao obter detalhes das postagens:", error);
      throw error;
    }
  }

  async queryPostagem(query) {
    const connection = await this.dbConnection.connect();
    try {
      const [rows] = await connection.execute(
        `
        SELECT 
          p.id AS postagem_id,
          p.titulo AS postagem_titulo,
          p.tipo_postagem AS postagem_tipo,
          p.data_publicacao AS postagem_data_publicacao,
  
          u.id AS usuario_id,
          u.nome AS usuario_nome_completo,
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
        WHERE
          p.titulo LIKE ? OR ct.descricao LIKE ? OR d.texto LIKE ?
        ORDER BY 
          p.data_publicacao DESC
      `,
        [`%${query}%`,`%${query}%`,`%${query}%`]
      );
      return rows;
    } catch (error) {
      console.error("Erro ao obter detalhes das postagens:", error);
      throw error;
    }
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

    // Obter a postagem para verificar o tipo
    const postagem = await this.getPostagemById(id);

    // Se for conteúdo, excluir o conteúdo associado
    if (postagem.tipo_postagem === "Conteudo") {
      const conteudo = await conteudoRepository.getConteudoByPostagemId(id);
      if (conteudo) {
        await conteudoRepository.deleteConteudoByPostagemId(id);
      }
    }

    // Se for discussão, excluir a discussão associada
    if (postagem.tipo_postagem === "Discussao") {
      const discussao = await discussaoRepository.getDiscussaoByPostagemId(id);
      if (discussao) {
        await discussaoRepository.deleteDiscussaoByPostagemId(id);
      }
    }

    // Excluir a postagem
    const [result] = await connection.execute(
      "DELETE FROM Postagens WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  }

  async deletePostagensByAutorId(autorId) {
    const connection = await this.dbConnection.connect();

    // Obter todas as postagens do autor
    const [postagens] = await connection.execute(
      "SELECT * FROM Postagens WHERE autor_id = ?",
      [autorId]
    );

    if (postagens.length > 0) {
      // Deletar conteúdo ou discussão de cada postagem antes de deletá-las
      for (const postagem of postagens) {
        if (postagem.tipo_postagem === "Conteudo") {
          await conteudoRepository.deleteConteudoByPostagemId(postagem.id); // Deleta conteúdo
        } else if (postagem.tipo_postagem === "Discussao") {
          await discussaoRepository.deleteDiscussaoByPostagemId(postagem.id); // Deleta discussão
        }

        // Deleta a postagem
        await connection.execute("DELETE FROM Postagens WHERE id = ?", [
          postagem.id,
        ]);
      }
    }

    return true;
  }
}

module.exports = PostagemRepository;
