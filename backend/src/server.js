const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

connectDB()
  .then(() => {
    app.listen(env.port, () => console.log(`API listening on http://localhost:${env.port}`));
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
