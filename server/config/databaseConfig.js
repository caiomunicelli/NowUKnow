DB_USER="nowuknow"
DB_PASSWORD="zuba@123"
DB_SERVER="nowuknow.database.windows.net"
DB_NAME="nowuknow"
SECRET_KEY="zubas123"

// DatabaseConfig.js
class DatabaseConfig {
    constructor() {
        this.config = {
            user: process.env.DB_USER || DB_USER ,
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
