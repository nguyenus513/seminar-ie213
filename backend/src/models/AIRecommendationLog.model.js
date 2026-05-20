const mongoose = require("mongoose");

const aiRecommendationLogSchema = new mongoose.Schema(
  {
    queryKey: String,
    queryShape: Object,
    currentStats: Object,
    currentIndexes: Array,
    recommendations: Array,
    reasoning: [String],
    tradeOffs: [String],
    riskLevel: String,
    advisorMode: String,
    acceptedRecommendation: Object,
    validationResult: Object
  },
  { timestamps: { createdAt: true, updatedAt: false }, autoIndex: false }
);

module.exports = mongoose.model("AIRecommendationLog", aiRecommendationLogSchema);
