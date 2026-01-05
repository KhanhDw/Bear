import { buildApp } from "./app.js";
const start = async () => {
    const app = buildApp();
    try {
        const address = await app.listen({
            port: 8080,
            host: "0.0.0.0",
        });
        app.log.info(`Gateway listening at ${address}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
