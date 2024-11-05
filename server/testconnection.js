const mysql = require("mysql2/promise");
require("dotenv").config({ debug: true });

async function testDatabaseConnection() {
  const config = {
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Porta padrão é 3306
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    // Fechar a conexão
    await connection.end();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:");
    console.error(error.message);
  }
}

testDatabaseConnection();
