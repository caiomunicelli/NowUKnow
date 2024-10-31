
// DatabaseConfig.js

class DatabaseConfig {
    constructor() {
        this.config = {
            user: process.env.DB_USER ,
            password: process.env.DB_PASSWORD ,
            server: process.env.DB_SERVER ,
            database: process.env.DB_NAME ,
        };
    }

    getConfig() {
        return this.config;
    }
}

module.exports = DatabaseConfig;
