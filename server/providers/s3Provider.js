const { S3Client } = require("@aws-sdk/client-s3");
const S3Config = require("./config/s3Config.js");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
class S3Provider {
  constructor() {
    this.config = new S3Config().getConfig();
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

  async uploadFile(pasta, usuario, arquivo, sufixo = null) {
    // Conecta ao S3
    try {
      const { bucketName, region } = this.config;
      const nomeArquivo = `${pasta}/${Date.now()}_${usuario}${sufixo || ""}`; // Nome único baseado no usuário e timestamp

      const uploadParams = {
        Bucket: bucketName,
        Key: nomeArquivo, // Nome do arquivo no S3
        Body: arquivo.buffer, // Conteúdo do arquivo, armazenado em memória
        ContentType: arquivo.mimetype, // Tipo MIME do arquivo
      };

      // Envia o arquivo para o S3
      const uploader = new Upload({
        client: this.s3Client,
        params: uploadParams,
        queueSize: 3,
        leavePartsOnError: false,
      });

      const result = await uploader.done();

      console.log("Upload concluído: ", result);
      const url_arquivo = `https://${bucketName}.s3.${region}.amazonaws.com/${pasta}/${nomeArquivo}`;
      return result.Location || url_arquivo;
    } catch (err) {
      console.error("Erro ao fazer upload para o S3:", err);
      throw err;
    } finally {
      this.close();
    }
  }

  async deleteFile(arquivoUrl) {
    try {
      const { bucketName } = this.config;

      // Extraímos o nome do arquivo (Key) da URL fornecida
      const fileKey = arquivoUrl.replace(
        `https://${bucketName}.s3.${this.config.region}.amazonaws.com/`,
        ""
      );

      const deleteParams = {
        Bucket: bucketName,
        Key: fileKey, // Caminho do arquivo a ser deletado
      };

      const deleteCommand = new DeleteObjectCommand(deleteParams);

      // Deleta o arquivo no S3
      await this.s3Client.send(deleteCommand);

      console.log(`Arquivo ${fileKey} deletado com sucesso!`);
      return true;
    } catch (err) {
      console.error("Erro ao deletar o arquivo no S3:", err);
      throw err;
    } finally {
      this.close();
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

module.exports = S3Provider;
