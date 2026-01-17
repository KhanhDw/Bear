import { buildApp } from "./app.js";
import { config } from "dotenv";
import { connectProducer } from "../../libs/kafka/index.js";

config();

async function start() {
  const app = buildApp();

  try {
    // Connect Kafka producer
    await connectProducer();

    const port = Number(process.env.PORT) || 3005;
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`Auth service listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();