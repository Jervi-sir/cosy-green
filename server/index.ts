import { env } from "./config/env";
import { sql } from "./db";
import { seedDemoData } from "./seed";
import { buildServer } from "./app";

async function start() {
  const app = await buildServer();

  app.addHook("onClose", async () => {
    await sql.end();
  });

  await seedDemoData();
  await app.listen({ host: env.HOST, port: env.PORT });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
