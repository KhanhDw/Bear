import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  PORT: port({ default: 3002 }),
  DATABASE_URL: str({ desc: 'PostgreSQL connection string' }),
  KAFKA_BROKERS: str({ desc: 'Comma-separated Kafka brokers', default: 'localhost:9092' }),
  NODE_ENV: str({ default: 'development' }),
  JWT_SECRET: str({ desc: 'JWT secret key' }),
  REDIS_HOST: str({ default: 'localhost' }),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_PASSWORD: str({ default: '' }),
  REDIS_DB: port({ default: 0 }),
});