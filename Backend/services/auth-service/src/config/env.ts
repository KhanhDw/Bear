import 'dotenv/config';
import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  // NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  URL_HOST: str({ default: 'localhost:3001' }),
  PORT: port({ default: 3001 }),

  DB_HOST: str(),
  DB_PORT: port(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),

  JWT_SECRET: str({ devDefault: 'test-secret' }),

  KAFKA_BROKERS: str({ default: 'localhost:29092' }),

  REDIS_HOST: str({ default: 'localhost' }),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_PASSWORD: str({ default: '' }),

  // Email configuration
  EMAIL_SERVICE: str({ default: 'gmail' }),
  EMAIL_HOST: str({ default: 'smtp.gmail.com' }),
  EMAIL_PORT: port({ default: 587 }),
  EMAIL_USER: str({ devDefault: 'yc788720@gmail.com' }),
  EMAIL_PASS: str({ devDefault: 'ctfu romk nrzb gpbn' }),
  EMAIL_FROM: str({ default: 'Bear Social <no-reply@bear.social>' }),
});
