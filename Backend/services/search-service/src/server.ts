import { buildApp } from "./app.js";

const start = async () => {
  const app = buildApp();

  try {
    await app.listen({
      port: 3004, // Using port 3004 for search service
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();