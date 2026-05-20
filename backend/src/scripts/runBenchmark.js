const connectDB = require("../config/db");
const { runAllBenchmarks } = require("../services/benchmark.service");

const modeArg = process.argv.find((arg) => arg.startsWith("--mode="));
const mode = modeArg ? modeArg.split("=")[1] : "custom";

connectDB().then(async () => {
  console.log(JSON.stringify(await runAllBenchmarks({ mode, iterations: 5, limit: 500, saveLog: true }), null, 2));
  process.exit(0);
}).catch((error) => { console.error(error); process.exit(1); });
