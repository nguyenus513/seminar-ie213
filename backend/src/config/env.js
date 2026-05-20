require("dotenv").config();

const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/mern_indexing_benchmark",
  nodeEnv: process.env.NODE_ENV || "development",
  mongooseAutoIndex: process.env.MONGOOSE_AUTO_INDEX === "true",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  defaultProducts: Number(process.env.DEFAULT_PRODUCTS || 30000),
  defaultOrders: Number(process.env.DEFAULT_ORDERS || 80000),
  defaultUsers: Number(process.env.DEFAULT_USERS || 10000)
};

module.exports = env;
