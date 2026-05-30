const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { seedData, clearData, getSeedStatus } = require("../services/seed.service");

exports.seed = asyncHandler(async (req, res) => res.json(new ApiResponse(await seedData(req.body), "Seed completed")));
exports.clear = asyncHandler(async (req, res) => { await clearData(); res.json(new ApiResponse(await getSeedStatus(), "Data cleared")); });
exports.status = asyncHandler(async (req, res) => res.json(new ApiResponse(await getSeedStatus())));
