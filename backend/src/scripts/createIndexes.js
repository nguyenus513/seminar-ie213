const connectDB = require("../config/db");
const { createAllIndexes } = require("../services/index.service");

connectDB().then(async () => {
  console.log(await createAllIndexes());
  process.exit(0);
}).catch((error) => { console.error(error); process.exit(1); });
