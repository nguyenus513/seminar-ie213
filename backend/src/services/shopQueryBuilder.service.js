function buildProductSearchQuery(params) {
  const { q, category, brand, minPrice, maxPrice, searchMode = "text" } = params;
  const filter = { isActive: true };
  if (q) {
    if (searchMode === "regex") filter.name = { $regex: q, $options: "i" };
    else filter.$text = { $search: q };
  }
  if (category && category !== "all") filter.category = category;
  if (brand && brand !== "all") filter.brand = brand;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  return filter;
}

function buildProductSort(sort, hasTextSearch = false) {
  if (sort === "price_asc") return { price: 1 };
  if (sort === "price_desc") return { price: -1 };
  if (sort === "rating_desc") return { rating: -1 };
  if (sort === "sold_desc") return { sold: -1 };
  if (sort === "newest") return { createdAt: -1 };
  if (hasTextSearch) return { score: { $meta: "textScore" } };
  return { createdAt: -1 };
}

module.exports = { buildProductSearchQuery, buildProductSort };
