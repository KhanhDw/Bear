import { buildApp } from "./app.js";
import { connectProducer } from "../../../libs/kafka/index.js";
import "./config/kafka.js";
const start = async () => {
  const app = buildApp();

  await connectProducer();

  try {
    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
