import { GracefulShutdown } from '../../libs/reliability/src/graceful.shutdown.js';
import { buildApp } from "./app.js";
import { env } from './config/env.js';

const start = async () => {
  const app = buildApp();
  const gracefulShutdown = new GracefulShutdown(app);

  try {
    const address = await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    app.log.info(`Gateway listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
