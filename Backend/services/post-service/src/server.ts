import { buildApp } from "./app.js";

const start = async () => {
  const app = await buildApp();

  try {
    await app.listen({
      port: 3003, // Using port 3003 for post service
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();