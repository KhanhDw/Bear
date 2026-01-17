import { buildApp } from "./app.js";
import { connectProducer } from "../../../libs/kafka/index.js";
import "./config/kafka.js"; // Import Kafka config to initialize producer

const start = async () => {
  const app = buildApp();

  try {
    // Connect Kafka producer
    await connectProducer();

    await app.listen({
      port: 3001, // Using port 3001 for user service
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();