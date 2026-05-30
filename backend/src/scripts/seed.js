const connectDB = require("../config/db");
const { seedData } = require("../services/seed.service");

connectDB().then(async () => {
  const status = await seedData();
  console.log(status);
  process.exit(0);
}).catch((error) => { console.error(error); process.exit(1); });
