const connectDB = require("../config/db");
const { clearData, getSeedStatus } = require("../services/seed.service");

connectDB().then(async () => {
  await clearData();
  console.log(await getSeedStatus());
  process.exit(0);
}).catch((error) => { console.error(error); process.exit(1); });
