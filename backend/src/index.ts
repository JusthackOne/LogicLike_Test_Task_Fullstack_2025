import { createServer } from "http";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { migrate } from "./db/migrate.js";

async function main() {
  await migrate();
  const app = createApp();
  const server = createServer(app);
  server.listen(config.port, () => {
    console.log(`Server running on :${config.port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
