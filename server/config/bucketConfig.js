class BucketConfig {
  constructor() {
    this.config = {
      bucketName: process.env.BUCKET_NAME,
      accessKeyId: process.env.IAM_ACCESS_KEY,
      secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY,
      region: process.env.BUCKET_REGION,
    };
  }
  getConfig() {
    return this.config;
  }
}

module.exports = BucketConfig;
