function getFilterFields(filter = {}) {
  return Object.keys(filter).filter((key) => !key.startsWith("$") && typeof filter[key] !== "undefined");
}

function getRangeFields(filter = {}) {
  return getFilterFields(filter).filter((key) => filter[key] && typeof filter[key] === "object" && ("$gte" in filter[key] || "$lte" in filter[key] || "$gt" in filter[key] || "$lt" in filter[key]));
}

function getEqualityFields(filter = {}) {
  const ranges = new Set(getRangeFields(filter));
  return getFilterFields(filter).filter((key) => !ranges.has(key));
}

function buildCompoundIndex(filter = {}, sort = {}) {
  const index = {};
  for (const field of getEqualityFields(filter)) index[field] = 1;
  for (const [field, direction] of Object.entries(sort || {})) index[field] = direction;
  for (const field of getRangeFields(filter)) if (!(field in index)) index[field] = 1;
  return index;
}

function isLowSelectivity(filter = {}) {
  return Object.keys(filter).some((field) => ["category", "status", "isActive", "role"].includes(field));
}

function analyzeQueryPattern({ queryKey, filter = {}, sort = {}, projection = null, stats = {} }) {
  const filterFields = getFilterFields(filter);
  const sortFields = Object.keys(sort || {});
  const projectionFields = projection ? Object.keys(projection).filter((field) => projection[field] && field !== "_id") : [];
  const recommendations = [];
  const reasoning = [];
  const tradeOffs = ["Mỗi index mới làm tăng dung lượng lưu trữ.", "Insert/update/delete có thể chậm hơn vì MongoDB phải cập nhật index."];
  if (filter.$text) {
    recommendations.push({ type: "text", index: { name: "text", brand: "text", description: "text", tags: "text" }, reason: "Query dùng keyword search nên text index phù hợp hơn regex/COLLSCAN.", expectedBenefit: "Giảm quét collection khi tìm kiếm sản phẩm theo từ khóa." });
  }
  if (filterFields.length === 1 && sortFields.length === 0 && !filter.$text) {
    recommendations.push({ type: "single-field", index: { [filterFields[0]]: 1 }, reason: `${filterFields[0]} là filter field duy nhất.`, expectedBenefit: "Phù hợp query lọc đơn giản." });
  }
  if ((filterFields.length > 0 && sortFields.length > 0) || filterFields.length > 1) {
    const index = buildCompoundIndex(filter, sort);
    recommendations.push({ type: "compound-esr", index, reason: "Index được sắp theo Equality → Sort → Range dựa trên query pattern.", expectedBenefit: "Có thể giảm COLLSCAN/SORT và giảm docsExamined." });
  }
  if (filter.isActive === true) {
    const index = buildCompoundIndex(filter, sort);
    recommendations.push({ type: "partial", index, options: { partialFilterExpression: { isActive: true } }, reason: "Query chỉ quan tâm sản phẩm đang hoạt động.", expectedBenefit: "Index nhỏ hơn full index nếu workload thường lọc isActive=true." });
  }
  if (projectionFields.length && filterFields.length) {
    const index = { ...buildCompoundIndex(filter, sort) };
    for (const field of projectionFields) if (!(field in index)) index[field] = 1;
    recommendations.push({ type: "covered-query", index, reason: "Projection fields có thể được đưa vào index để giảm nhu cầu đọc document gốc.", expectedBenefit: "Có khả năng tạo covered query nếu toàn bộ field cần đọc nằm trong index." });
  }
  if (stats.stage === "COLLSCAN" || stats.hasSortStage) reasoning.push("Execution plan hiện tại có COLLSCAN/SORT nên có dấu hiệu cần tối ưu index.");
  if (stats.totalDocsExamined && stats.nReturned) reasoning.push(`docsExamined/nReturned ≈ ${(stats.totalDocsExamined / Math.max(stats.nReturned, 1)).toFixed(2)}, dùng để đánh giá mức lãng phí quét dữ liệu.`);
  if (isLowSelectivity(filter)) reasoning.push("Một số field như category/status/isActive có thể có selectivity thấp; index có thể giảm docsExamined nhưng chưa chắc luôn giảm execution time.");
  return {
    queryKey,
    filterFields,
    sortFields,
    projectionFields,
    recommendations: recommendations.slice(0, 3),
    reasoning,
    tradeOffs,
    riskLevel: isLowSelectivity(filter) ? "medium" : "low",
    validationPlan: ["Tạo index được gợi ý", "Chạy benchmark 5 iterations", "So sánh executionTimeMillis", "So sánh totalDocsExamined/totalKeysExamined", "Kiểm tra stage có chuyển sang IXSCAN hoặc giảm SORT không"]
  };
}

module.exports = { analyzeQueryPattern, buildCompoundIndex, getFilterFields, getRangeFields, getEqualityFields };
