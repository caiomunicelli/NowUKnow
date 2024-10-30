// DatabaseConfig.js
DB_USER=""
DB_PASSWORD=""
DB_SERVER=""
DB_NAME=""
class DatabaseConfig {
    constructor() {
        this.config = {
            user: process.env.DB_USER || DB_USER,
            password: process.env.DB_PASSWORD || DB_PASSWORD,
            server: process.env.DB_SERVER || DB_SERVER,
            database: process.env.DB_NAME || DB_NAME,
        };
    }

    getConfig() {
        return this.config;
    }
}

module.exports = DatabaseConfig;
