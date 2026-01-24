import { config } from "dotenv";
import { buildApp } from "./app";

config();

async function start() {
  const app = await buildApp();

  try {
    const port = Number(process.env.PORT) || 3005;
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`Auth service listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
