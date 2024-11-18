// DatabaseConfig.js
class DatabaseConfig {
  constructor() {
    this.config = {
      host: process.env.DB_SERVER ,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  }

  getConfig() {
    return this.config;
  }
}

module.exports = DatabaseConfig;
