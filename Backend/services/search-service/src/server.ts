import { buildApp } from "./app.js";
import SearchService from "./modules/search/search.service.js";
import KafkaSearchConsumer from "./modules/search/kafka-search.consumer.js";
import { setKafkaAdmin } from "./health/health.route.js";

const start = async () => {
  const app = buildApp();

  try {
    // Initialize search service and Kafka consumer
    await SearchService.initialize();
    await KafkaSearchConsumer.initialize();

    // Set up health check with Kafka admin for connectivity checking
    // Note: This is a simplified approach - in a real implementation,
    // you'd want to pass the actual Kafka admin client
    const mockKafkaAdmin = {
      connect: async () => { /* Mock connection */ },
      disconnect: async () => { /* Mock disconnection */ }
    };
    setKafkaAdmin(mockKafkaAdmin);

    await app.listen({
      port: 3004, // Using port 3004 for search service
      host: "0.0.0.0",
    });

    console.log(`Search service listening on port ${3004}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down search service...');
  try {
    await KafkaSearchConsumer.shutdown();
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

start();