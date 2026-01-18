import { cleanEnv, port, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
  PORT: port({ default: 3008 }),
  DATABASE_URL: str({ desc: 'PostgreSQL connection string' }),
  KAFKA_BROKERS: str({ desc: 'Comma-separated Kafka brokers', default: 'localhost:9092' }),
  NODE_ENV: str({ default: 'development' }),
  JWT_SECRET: str({ desc: 'JWT secret key' }),
  AWS_ACCESS_KEY_ID: str({ desc: 'AWS Access Key ID', default: '' }),
  AWS_SECRET_ACCESS_KEY: str({ desc: 'AWS Secret Access Key', default: '' }),
  AWS_REGION: str({ desc: 'AWS Region', default: 'us-east-1' }),
  S3_BUCKET_NAME: str({ desc: 'S3 Bucket Name', default: 'bear-media-bucket' }),
  UPLOAD_DIR: str({ desc: 'Local upload directory', default: './uploads' }),
});