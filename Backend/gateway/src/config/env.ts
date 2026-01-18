import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  PORT: port({ default: 8080 }),
  CORS_ORIGIN: str({ default: '*' }),
  JWT_SECRET: str({ desc: 'JWT secret key' }),
  NODE_ENV: str({ default: 'development' }),
  REDIS_URL: str({ default: '' }),
  AUTH_SERVICE_PORT: port({ default: 3001 }),
  USER_SERVICE_PORT: port({ default: 3002 }),
  POST_SERVICE_PORT: port({ default: 3003 }),
  COMMENT_SERVICE_PORT: port({ default: 3004 }),
  VOTE_SERVICE_PORT: port({ default: 3005 }),
  FEED_SERVICE_PORT: port({ default: 3006 }),
  NOTIFICATION_SERVICE_PORT: port({ default: 3007 }),
  MESSAGING_SERVICE_PORT: port({ default: 3008 }),
  MEDIA_SERVICE_PORT: port({ default: 3009 }),
  GROUP_SERVICE_PORT: port({ default: 3010 }),
  SEARCH_SERVICE_PORT: port({ default: 3011 }),
  ANALYTICS_SERVICE_PORT: port({ default: 3012 }),
  MODERATION_SERVICE_PORT: port({ default: 3013 }),
});