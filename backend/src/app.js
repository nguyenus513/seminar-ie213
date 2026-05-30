const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const notFound = require("./middlewares/notFound.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 60 * 1000, limit: 300 }));

app.get("/api/health", (req, res) => res.json({ success: true, message: "MERN MongoDB benchmark API is running" }));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/seed", require("./routes/seed.routes"));
app.use("/api/indexes", require("./routes/indexes.routes"));
app.use("/api/benchmark", require("./routes/benchmark.routes"));
app.use("/api/explain", require("./routes/explain.routes"));
app.use("/api/shop", require("./routes/shop.routes"));
app.use("/api/ai-advisor", require("./routes/aiAdvisor.routes"));

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
