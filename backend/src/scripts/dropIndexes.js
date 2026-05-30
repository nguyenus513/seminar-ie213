const connectDB = require("../config/db");
const { dropAllCustomIndexes } = require("../services/index.service");

connectDB().then(async () => {
  console.log(await dropAllCustomIndexes());
  process.exit(0);
}).catch((error) => { console.error(error); process.exit(1); });
