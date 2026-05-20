const { faker } = require("@faker-js/faker");
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const User = require("../models/User.model");
const BenchmarkRun = require("../models/BenchmarkRun.model");
const SearchLog = require("../models/SearchLog.model");
const env = require("../config/env");

const categories = ["phone", "laptop", "tablet", "watch", "accessory", "audio", "camera", "gaming"];
const brands = ["Apple", "Samsung", "Xiaomi", "Oppo", "Dell", "Asus", "Lenovo", "Sony", "Logitech"];
const statuses = ["pending", "paid", "shipping", "delivered", "cancelled"];
const paymentMethods = ["cod", "credit_card", "momo", "bank_transfer"];
const templates = [
  ["Apple", "phone", "iPhone 15 Pro Max"],
  ["Apple", "phone", "iPhone 14"],
  ["Samsung", "phone", "Samsung Galaxy S24 Ultra"],
  ["Xiaomi", "phone", "Xiaomi 14"],
  ["Dell", "laptop", "Dell XPS 13"],
  ["Asus", "laptop", "Asus ROG Zephyrus G14"],
  ["Lenovo", "laptop", "Lenovo ThinkPad X1"],
  ["Apple", "watch", "Apple Watch Series 9"],
  ["Sony", "audio", "Sony WH-1000XM5"],
  ["Logitech", "accessory", "Logitech MX Master 3S"]
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makeProduct(index) {
  const template = templates[index % templates.length];
  const brand = template?.[0] || faker.helpers.arrayElement(brands);
  const category = template?.[1] || faker.helpers.arrayElement(categories);
  const baseName = template?.[2] || `${brand} ${faker.commerce.productName()}`;
  const storage = faker.helpers.arrayElement(["64GB", "128GB", "256GB", "512GB", "1TB", "16GB RAM", "32GB RAM"]);
  const color = faker.helpers.arrayElement(["Black", "Silver", "Blue", "Natural Titanium", "Graphite", "White"]);
  const name = `${baseName} ${storage} ${color}`;
  const price = faker.number.int({ min: 500000, max: 60000000 });
  const discountPercent = faker.number.int({ min: 0, max: 35 });
  const originalPrice = Math.round(price / (1 - discountPercent / 100));
  const tags = [brand.toLowerCase(), category, baseName.toLowerCase(), storage.toLowerCase(), color.toLowerCase()];
  return {
    name,
    slug: `${slugify(name)}-${index}`,
    category,
    brand,
    price,
    originalPrice,
    discountPercent,
    stock: faker.number.int({ min: 0, max: 500 }),
    rating: Number(faker.number.float({ min: 3.1, max: 5, fractionDigits: 1 })),
    reviewCount: faker.number.int({ min: 0, max: 5000 }),
    sold: faker.number.int({ min: 0, max: 20000 }),
    shortDescription: `${name} chính hãng, bảo hành đầy đủ, phù hợp demo MERN indexing benchmark.`,
    description: `${name} thuộc nhóm ${category}, thương hiệu ${brand}. Sản phẩm dùng để demo text search, filter, sort và MongoDB execution plan.`,
    imageUrl: `https://picsum.photos/seed/product-${index}/600/420`,
    images: [`https://picsum.photos/seed/product-${index}-1/600/420`, `https://picsum.photos/seed/product-${index}-2/600/420`],
    tags,
    isActive: faker.datatype.boolean({ probability: 0.92 }),
    createdAt: faker.date.between({ from: "2025-01-01", to: "2026-05-07" }),
    updatedAt: faker.date.recent({ days: 60 })
  };
}

async function insertInBatches(Model, total, factory, batchSize = 1000) {
  let inserted = 0;
  while (inserted < total) {
    const size = Math.min(batchSize, total - inserted);
    const docs = Array.from({ length: size }, (_, offset) => factory(inserted + offset));
    await Model.insertMany(docs, { ordered: false });
    inserted += size;
    process.stdout.write(`\r${Model.collection.name}: ${inserted}/${total}`);
  }
  process.stdout.write("\n");
}

async function clearData() {
  await Promise.all([Product.deleteMany({}), Order.deleteMany({}), User.deleteMany({}), BenchmarkRun.deleteMany({}), SearchLog.deleteMany({})]);
}

async function seedData({ products = env.defaultProducts, orders = env.defaultOrders, users = env.defaultUsers } = {}) {
  await clearData();
  await insertInBatches(User, Number(users), (index) => ({
    name: faker.person.fullName(),
    email: `user${index}@benchmark.local`,
    phone: faker.phone.number(),
    role: "customer",
    isActive: faker.datatype.boolean({ probability: 0.95 }),
    createdAt: faker.date.between({ from: "2024-01-01", to: "2026-05-07" })
  }));
  const userIds = await User.find().select("_id").lean();
  await insertInBatches(Product, Number(products), makeProduct);
  await insertInBatches(Order, Number(orders), () => ({
    userId: faker.helpers.arrayElement(userIds)._id,
    status: faker.helpers.arrayElement(statuses),
    paymentMethod: faker.helpers.arrayElement(paymentMethods),
    totalAmount: faker.number.int({ min: 100000, max: 100000000 }),
    itemCount: faker.number.int({ min: 1, max: 8 }),
    createdAt: faker.date.between({ from: "2025-01-01", to: "2026-05-07" }),
    updatedAt: faker.date.recent({ days: 30 })
  }));
  return getSeedStatus();
}

async function getSeedStatus() {
  const [products, orders, users, benchmarkRuns, searchLogs] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
    BenchmarkRun.countDocuments(),
    SearchLog.countDocuments()
  ]);
  return { products, orders, users, benchmarkRuns, searchLogs };
}

module.exports = { seedData, clearData, getSeedStatus, categories, brands };
