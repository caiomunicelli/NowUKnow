const Info = require('../info.js')
info = new Info()
// DatabaseConfig.js
class DatabaseConfig {
    constructor() {
        this.config = {
            user: info.DB_USER         || process.env.DB_USER,
            password: info.DB_PASSWORD || process.env.DB_PASSWORD,
            server: info.DB_SERVER     || process.env.DB_SERVER,
            database: info.DB_NAME     || process.env.DB_NAME,
        };
    }

    getConfig() {
        return this.config;
    }
}

module.exports = DatabaseConfig;
