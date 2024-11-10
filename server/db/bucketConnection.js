const { S3Client } = require("@aws-sdk/client-s3");
const BucketConfig = require("../config/bucketConfig.js");

class BucketConnection {
  constructor() {
    this.config = new BucketConfig().getConfig();
    this.s3Client = null;
  }

  async connect() {
    try {
      if (!this.s3Client) {
        this.s3Client = new S3Client({
          credentials: {
            accessKeyId: this.config.accessKeyId,
            secretAccessKey: this.config.secretAccessKey,
          },
          region: this.config.region,
        });
        console.log("Conexão com S3 bem-sucedida!");
      }
      return this.s3Client;
    } catch (err) {
      console.error("Erro na conexão com S3:", err);
      throw err;
    }
  }

  async close() {
    if (this.s3Client) {
      // O cliente S3 não requer fechamento explícito, mas limpamos a referência
      this.s3Client = null;
      console.log("Conexão com S3 encerrada!");
    }
  }
}

module.exports = BucketConnection;
