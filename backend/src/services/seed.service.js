const { faker } = require("@faker-js/faker");
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const User = require("../models/User.model");
const BenchmarkRun = require("../models/BenchmarkRun.model");
const SearchLog = require("../models/SearchLog.model");
const env = require("../config/env");

const statuses = ["pending", "paid", "shipping", "delivered", "cancelled"];
const paymentMethods = ["cod", "credit_card", "momo", "bank_transfer"];

const productCatalog = [
  {
    brand: "Apple",
    category: "phone",
    baseName: "iPhone 15 Pro Max",
    variants: [
      { label: "256GB", price: 26990000 },
      { label: "512GB", price: 32990000 },
      { label: "1TB", price: 38990000 }
    ],
    colors: ["Natural Titanium", "White", "Black", "Blue"]
  },
  {
    brand: "Apple",
    category: "phone",
    baseName: "iPhone 14",
    variants: [
      { label: "128GB", price: 13990000 },
      { label: "256GB", price: 16990000 },
      { label: "512GB", price: 21990000 }
    ],
    colors: ["Black", "White", "Blue"]
  },
  {
    brand: "Samsung",
    category: "phone",
    baseName: "Samsung Galaxy S24 Ultra",
    variants: [
      { label: "256GB", price: 21990000 },
      { label: "512GB", price: 25990000 },
      { label: "1TB", price: 31990000 }
    ],
    colors: ["Silver", "Black", "Blue", "Graphite"]
  },
  {
    brand: "Xiaomi",
    category: "phone",
    baseName: "Xiaomi 14",
    variants: [
      { label: "256GB", price: 15990000 },
      { label: "512GB", price: 18990000 }
    ],
    colors: ["Black", "White", "Green"]
  },
  {
    brand: "Oppo",
    category: "phone",
    baseName: "Oppo Find X7",
    variants: [
      { label: "256GB", price: 14990000 },
      { label: "512GB", price: 17990000 }
    ],
    colors: ["Black", "Blue", "Silver"]
  },
  {
    brand: "Apple",
    category: "tablet",
    baseName: "iPad Air 11",
    variants: [
      { label: "128GB WiFi", price: 16990000 },
      { label: "256GB WiFi", price: 19990000 },
      { label: "256GB Cellular", price: 23990000 }
    ],
    colors: ["Blue", "Purple", "Starlight", "Space Gray"]
  },
  {
    brand: "Samsung",
    category: "tablet",
    baseName: "Samsung Galaxy Tab S9",
    variants: [
      { label: "128GB WiFi", price: 16990000 },
      { label: "256GB WiFi", price: 19990000 },
      { label: "256GB 5G", price: 23990000 }
    ],
    colors: ["Graphite", "Beige"]
  },
  {
    brand: "Dell",
    category: "laptop",
    baseName: "Dell XPS 13",
    variants: [
      { label: "16GB RAM 512GB SSD", price: 32990000 },
      { label: "32GB RAM 1TB SSD", price: 42990000 }
    ],
    colors: ["Silver", "Graphite"]
  },
  {
    brand: "Asus",
    category: "laptop",
    baseName: "Asus ROG Zephyrus G14",
    variants: [
      { label: "16GB RAM 512GB SSD", price: 39990000 },
      { label: "32GB RAM 1TB SSD", price: 52990000 }
    ],
    colors: ["White", "Graphite"]
  },
  {
    brand: "Lenovo",
    category: "laptop",
    baseName: "Lenovo ThinkPad X1",
    variants: [
      { label: "16GB RAM 512GB SSD", price: 34990000 },
      { label: "32GB RAM 1TB SSD", price: 44990000 }
    ],
    colors: ["Black"]
  },
  {
    brand: "Apple",
    category: "watch",
    baseName: "Apple Watch Series 9",
    variants: [
      { label: "41mm GPS", price: 8990000 },
      { label: "45mm GPS", price: 10490000 },
      { label: "45mm Cellular", price: 12990000 }
    ],
    colors: ["Midnight", "Starlight", "Silver"]
  },
  {
    brand: "Sony",
    category: "audio",
    baseName: "Sony WH-1000XM5",
    variants: [{ label: "Standard", price: 6990000 }],
    colors: ["Black", "Silver", "Blue"]
  },
  {
    brand: "Logitech",
    category: "accessory",
    baseName: "Logitech MX Master 3S",
    variants: [{ label: "Standard", price: 2390000 }],
    colors: ["Graphite", "White"]
  },
  {
    brand: "Sony",
    category: "camera",
    baseName: "Sony Alpha A6400",
    variants: [
      { label: "Body Only", price: 18990000 },
      { label: "Kit 18-135mm", price: 24990000 }
    ],
    colors: ["Black"]
  },
  {
    brand: "Sony",
    category: "gaming",
    baseName: "PlayStation 5 Slim",
    variants: [
      { label: "Digital Edition", price: 11490000 },
      { label: "Standard Edition", price: 13490000 }
    ],
    colors: ["White"]
  }
];

const syntheticCatalog = [
  {
    brand: "Apple",
    category: "phone",
    families: ["iPhone 15 Pro Max", "iPhone 15 Pro"],
    variants: ["128GB", "256GB", "512GB", "1TB"],
    colors: ["Black", "White", "Blue", "Natural Titanium"],
    basePrice: 18990000
  },
  {
    brand: "Apple",
    category: "phone",
    families: ["iPhone 15 Plus", "iPhone 15"],
    variants: ["128GB", "256GB", "512GB"],
    colors: ["Black", "Blue", "Green", "Pink", "Yellow"],
    basePrice: 16990000
  },
  {
    brand: "Apple",
    category: "phone",
    families: ["iPhone 14 Pro Max", "iPhone 14 Pro"],
    variants: ["128GB", "256GB", "512GB"],
    colors: ["Black", "Silver", "Gold", "Purple"],
    basePrice: 12990000
  },
  {
    brand: "Apple",
    category: "phone",
    families: ["iPhone 14 Plus", "iPhone 14"],
    variants: ["128GB", "256GB", "512GB"],
    colors: ["Black", "White", "Blue", "Purple", "Red", "Yellow"],
    basePrice: 11990000
  },
  {
    brand: "Apple",
    category: "phone",
    families: ["iPhone 13", "iPhone SE"],
    variants: ["64GB", "128GB", "256GB"],
    colors: ["Black", "White", "Blue", "Red"],
    basePrice: 7990000
  },
  {
    brand: "Apple",
    category: "phone",
    families: ["iPhone 16 Pro Max", "iPhone 16 Pro"],
    variants: ["128GB", "256GB", "512GB", "1TB"],
    colors: ["Black", "White", "Natural Titanium", "Desert Titanium"],
    basePrice: 21990000
  },
  {
    brand: "Apple",
    category: "phone",
    families: ["iPhone 16 Plus", "iPhone 16"],
    variants: ["128GB", "256GB", "512GB"],
    colors: ["Black", "White", "Blue", "Teal", "Pink"],
    basePrice: 18990000
  },
  {
    brand: "Apple",
    category: "tablet",
    families: ["iPad Mini", "iPad Pro", "iPad Air"],
    variants: ["128GB WiFi", "256GB WiFi", "512GB Cellular", "1TB Cellular"],
    colors: ["Space Gray", "Silver", "Blue", "Purple"],
    basePrice: 12990000
  },
  {
    brand: "Samsung",
    category: "phone",
    families: ["Galaxy A", "Galaxy S", "Galaxy Z Flip", "Galaxy Z Fold"],
    variants: ["128GB", "256GB", "512GB", "1TB"],
    colors: ["Black", "Silver", "Blue", "Graphite", "Green"],
    basePrice: 8990000
  },
  {
    brand: "Xiaomi",
    category: "phone",
    families: ["Redmi Note", "Xiaomi T", "Poco F", "Xiaomi Lite"],
    variants: ["128GB", "256GB", "512GB"],
    colors: ["Black", "White", "Blue", "Green"],
    basePrice: 5990000
  },
  {
    brand: "Oppo",
    category: "phone",
    families: ["Reno", "Find X", "A Series", "F Series"],
    variants: ["128GB", "256GB", "512GB"],
    colors: ["Black", "Silver", "Blue", "Green"],
    basePrice: 5490000
  },
  {
    brand: "Dell",
    category: "laptop",
    families: ["Inspiron", "XPS", "Latitude", "Alienware"],
    variants: ["8GB RAM 512GB SSD", "16GB RAM 512GB SSD", "32GB RAM 1TB SSD"],
    colors: ["Silver", "Graphite", "Black"],
    basePrice: 14990000
  },
  {
    brand: "Asus",
    category: "laptop",
    families: ["Vivobook", "Zenbook", "ROG Strix", "TUF Gaming"],
    variants: ["8GB RAM 512GB SSD", "16GB RAM 512GB SSD", "32GB RAM 1TB SSD"],
    colors: ["Silver", "Graphite", "Black", "White"],
    basePrice: 12990000
  },
  {
    brand: "Lenovo",
    category: "laptop",
    families: ["IdeaPad", "Yoga", "ThinkBook", "Legion"],
    variants: ["8GB RAM 512GB SSD", "16GB RAM 512GB SSD", "32GB RAM 1TB SSD"],
    colors: ["Black", "Silver", "Graphite"],
    basePrice: 11990000
  },
  {
    brand: "Apple",
    category: "watch",
    families: ["Apple Watch SE", "Apple Watch Series", "Apple Watch Ultra"],
    variants: ["40mm GPS", "41mm GPS", "45mm GPS", "49mm Cellular"],
    colors: ["Midnight", "Starlight", "Silver", "Orange"],
    basePrice: 6490000
  },
  {
    brand: "Sony",
    category: "audio",
    families: ["WH", "WF", "LinkBuds", "ULT Wear"],
    variants: ["Standard", "Noise Cancelling", "Hi-Res"],
    colors: ["Black", "Silver", "Blue", "White"],
    basePrice: 2490000
  },
  {
    brand: "Logitech",
    category: "accessory",
    families: ["MX", "G Pro", "K Series", "StreamCam"],
    variants: ["Standard", "Wireless", "Performance"],
    colors: ["Black", "Graphite", "White"],
    basePrice: 790000
  },
  {
    brand: "Sony",
    category: "camera",
    families: ["Alpha", "ZV", "Cyber-shot", "Cinema Line"],
    variants: ["Body Only", "Kit Lens", "Creator Kit"],
    colors: ["Black", "Silver"],
    basePrice: 11990000
  },
  {
    brand: "Sony",
    category: "gaming",
    families: ["PlayStation", "DualSense", "Pulse", "Portal"],
    variants: ["Standard Edition", "Digital Edition", "Bundle"],
    colors: ["White", "Black", "Blue"],
    basePrice: 1990000
  }
];

const categories = [...new Set([...productCatalog, ...syntheticCatalog].map((product) => product.category))];
const brands = [...new Set([...productCatalog, ...syntheticCatalog].map((product) => product.brand))];
const realCatalogProducts = expandRealCatalog();

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function hashString(text) {
  return [...text].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 0);
}

function deterministicInt(key, min, max) {
  return min + (hashString(key) % (max - min + 1));
}

function expandRealCatalog() {
  return productCatalog.flatMap((product) =>
    product.variants.flatMap((variant) =>
      product.colors.map((color) => ({
        brand: product.brand,
        category: product.category,
        baseName: product.baseName,
        variant,
        color,
        price: variant.price
      }))
    )
  );
}

function pickFrom(list, index) {
  return list[index % list.length];
}

function getVariantPremium(label) {
  let premium = 0;
  if (/64GB/.test(label)) premium += 0;
  if (/128GB/.test(label)) premium += 1000000;
  if (/256GB/.test(label)) premium += 2500000;
  if (/512GB/.test(label)) premium += 5500000;
  if (/1TB/.test(label)) premium += 9500000;
  if (/16GB RAM/.test(label)) premium += 5000000;
  if (/32GB RAM/.test(label)) premium += 12000000;
  if (/Cellular|5G/.test(label)) premium += 4000000;
  if (/Kit Lens|Creator Kit|Kit 18-135mm|Bundle/.test(label)) premium += 3500000;
  if (/Noise Cancelling|Hi-Res|Performance|Wireless/.test(label)) premium += 1200000;
  if (/Ultra|49mm/.test(label)) premium += 5000000;
  return premium;
}

function makeSyntheticSpec(index) {
  const template = syntheticCatalog[index % syntheticCatalog.length];
  const group = Math.floor(index / syntheticCatalog.length);
  const familyIndex = group % template.families.length;
  const variantIndex = Math.floor(group / template.families.length) % template.variants.length;
  const colorIndex = Math.floor(group / (template.families.length * template.variants.length)) % template.colors.length;
  const family = template.families[familyIndex];
  const variantLabel = template.variants[variantIndex];
  const color = template.colors[colorIndex];
  const modelNumber = 1000 + group;
  const generation = 2024 + (group % 3);
  const baseName = `${template.brand} ${family} ${generation} M${modelNumber}`;
  const familyStep = (template.families.length - familyIndex - 1) * 1200000;
  const variantStep = getVariantPremium(variantLabel);
  const colorStep = deterministicInt(`${baseName}:${color}`, 0, 3) * 100000;

  return {
    brand: template.brand,
    category: template.category,
    baseName,
    variant: { label: variantLabel, price: template.basePrice + familyStep + variantStep + colorStep },
    color,
    price: template.basePrice + familyStep + variantStep + colorStep
  };
}

function buildProductName(baseName, variant, color) {
  return [baseName, variant.label === "Standard" ? "" : variant.label, color].filter(Boolean).join(" ");
}

function getProductSpec(index) {
  return realCatalogProducts[index] || makeSyntheticSpec(index - realCatalogProducts.length);
}

function makeProduct(index) {
  const productSpec = getProductSpec(index);
  const { brand, category, baseName, variant, color, price } = productSpec;
  const name = buildProductName(baseName, variant, color);
  const skuKey = `${brand}|${category}|${name}`;
  const discountPercent = deterministicInt(`${skuKey}:discount`, 0, 20);
  const originalPrice = Math.round(price / (1 - discountPercent / 100));
  const tags = [brand.toLowerCase(), category, baseName.toLowerCase(), variant.label.toLowerCase(), color.toLowerCase()];
  const imageSeed = slugify(name);
  return {
    name,
    slug: `${slugify(name)}-${index}`,
    category,
    brand,
    price,
    originalPrice,
    discountPercent,
    stock: deterministicInt(`${skuKey}:stock`, 0, 500),
    rating: Number((3.6 + deterministicInt(`${skuKey}:rating`, 0, 13) / 10).toFixed(1)),
    reviewCount: deterministicInt(`${skuKey}:reviews`, 20, 5000),
    sold: deterministicInt(`${skuKey}:sold`, 50, 20000),
    shortDescription: `${name} chính hãng, bảo hành đầy đủ, phù hợp demo MERN indexing benchmark.`,
    description: `${name} thuộc nhóm ${category}, thương hiệu ${brand}. Sản phẩm dùng để demo text search, filter, sort và MongoDB execution plan.`,
    imageUrl: `https://picsum.photos/seed/${imageSeed}/600/420`,
    images: [`https://picsum.photos/seed/${imageSeed}-1/600/420`, `https://picsum.photos/seed/${imageSeed}-2/600/420`],
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
