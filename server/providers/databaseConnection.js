const mysql = require("mysql2/promise");
const DatabaseConfig = require("./config/databaseConfig.js");

class DatabaseConnection {
  constructor() {
    this.config = new DatabaseConfig().getConfig();
    this.pool = null;
  }

  async connect() {
    try {
      if (!this.pool) {
        this.pool = mysql.createPool(this.config);
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
      await this.pool.end();
      this.pool = null;
      console.log("Conexão encerrada!");
    }
  }
}

module.exports = DatabaseConnection;
