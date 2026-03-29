import "dotenv/config";
import { connectDb } from "./config/db.js";
import { createApp } from "./app.js";

const port = parseInt(process.env.PORT || "3000", 10);

async function main() {
  await connectDb();
  const app = createApp();
  app.listen(port, () => {
    console.log(`CityKart API listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
