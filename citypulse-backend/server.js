import { createApp } from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";

async function start() {
  await connectDB();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`[server] CityPulse API running on port ${env.port} (${env.nodeEnv})`);
  });
}

start();
