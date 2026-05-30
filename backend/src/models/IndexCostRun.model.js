const mongoose = require("mongoose");

const indexCostRunSchema = new mongoose.Schema(
  {
    datasetLabel: String,
    indexCount: Number,
    insertedDocuments: Number,
    insertTimeMs: Number,
    indexSizeMB: Number,
    note: String
  },
  { timestamps: { createdAt: true, updatedAt: false }, autoIndex: false }
);

module.exports = mongoose.model("IndexCostRun", indexCostRunSchema);
