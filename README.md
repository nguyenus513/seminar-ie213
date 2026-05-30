# MERN E-commerce Search Benchmark Dashboard

> Seminar project: **MongoDB + Express.js + React Vite + Node.js**.  
> Chủ đề: **Triển khai và đánh giá các chiến lược Indexing trong MongoDB kết hợp phân tích Execution Plan trong ứng dụng MERN Stack**.

Hệ thống mô phỏng một website thương mại điện tử nhỏ có chức năng tìm kiếm/lọc/sắp xếp sản phẩm, đồng thời tích hợp dashboard để benchmark truy vấn MongoDB trước/sau khi tạo index, xem `explain("executionStats")`, so sánh nhiều chiến lược index và thử nghiệm AI Index Advisor dạng rule-based.

---

## 1. Tính năng chính

### 1.1. Web e-commerce demo

- Trang `/shop` để tìm kiếm sản phẩm.
- Search theo keyword.
- Filter theo category, brand, min price, max price.
- Sort theo relevance, giá, rating, lượt bán, newest.
- Product grid, product detail, cart demo bằng `localStorage`.
- Hiển thị thông số truy vấn như:
  - API response time.
  - MongoDB execution time.
  - Stage: `COLLSCAN`, `IXSCAN`, `FETCH`, `SORT`, `TEXT_MATCH`.
  - `totalDocsExamined`.
  - `totalKeysExamined`.
  - `nReturned`.
  - Index used.

### 1.2. MongoDB indexing benchmark

- Seed dữ liệu lớn giả lập.
- Drop custom indexes để chạy baseline.
- Tạo index theo strategy.
- Chạy benchmark trước/sau index.
- Chạy matrix benchmark nhiều chiến lược index.
- Xem execution plan thô.
- Export CSV kết quả benchmark.

### 1.3. Dashboard kỹ thuật

Các route chính:

| Route | Chức năng |
|---|---|
| `/shop` | Trang mua hàng và search product benchmark |
| `/dataset` | Seed data, clear data, xem số lượng documents |
| `/indexes` | Tạo/list/drop index |
| `/benchmark` | Chạy benchmark một query |
| `/strategy-comparison` | So sánh nhiều chiến lược index |
| `/compare` | So sánh baseline vs optimized |
| `/ai-index-advisor` | Rule-based AI Index Advisor |
| `/explain/:queryKey` | Xem execution plan |
| `/history` | Lịch sử benchmark và export CSV |

---

## 2. Công nghệ sử dụng

| Phần | Công nghệ |
|---|---|
| Database | MongoDB local qua Docker |
| Backend | Node.js, Express.js, Mongoose |
| Frontend | React Vite, React Router, Axios |
| UI | Tailwind CSS |
| Charts | Recharts |
| Seed data | `@faker-js/faker` |
| Security middleware | Helmet, CORS, express-rate-limit |
| Logging | Morgan |
| ML optional | Python, scikit-learn Random Forest skeleton |

---

## 3. Yêu cầu môi trường

Cần cài trước:

- Node.js `20+`
- npm
- Docker Desktop
- Git

Kiểm tra nhanh:

```bash
node -v
npm -v
docker -v
git --version
```

---

## 4. Cấu trúc thư mục

```text
webseminar/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── middlewares/
│   │   └── scripts/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   └── package.json
├── ml-index-advisor/
├── report/
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 5. Cài đặt lần đầu

### Bước 1: Clone source

```bash
git clone https://github.com/Minwsun/seminar-ie212.git
cd seminar-ie212
```

Nếu đã có source local thì mở terminal tại thư mục project.

### Bước 2: Cài dependencies

```bash
npm install
npm run install:all
```

Lệnh trên sẽ cài:

- Root dependencies.
- Backend dependencies.
- Frontend dependencies.

### Bước 3: Tạo file môi trường backend

```powershell
copy backend\.env.example backend\.env
```

File `backend/.env.example` mặc định:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_indexing_benchmark
NODE_ENV=development
MONGOOSE_AUTO_INDEX=false
DEFAULT_PRODUCTS=30000
DEFAULT_ORDERS=80000
DEFAULT_USERS=10000
CORS_ORIGIN=http://localhost:5173
```

---

## 6. Chạy MongoDB

### Cách 1: Dùng Docker Compose mặc định port 27017

```bash
docker compose up -d
```

Kiểm tra:

```bash
docker ps
```

Backend `.env` dùng:

```env
MONGO_URI=mongodb://localhost:27017/mern_indexing_benchmark
```

### Cách 2: Nếu port 27017 bị chiếm

Nếu máy đang có MongoDB khác hoặc container khác chiếm `27017`, chạy MongoDB demo ở port `27018`:

```bash
docker run -d --name mongodb-indexing-demo-27018 -p 27018:27017 mongo:7
```

Sau đó sửa `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27018/mern_indexing_benchmark
```

Nếu container đã tồn tại nhưng đang tắt:

```bash
docker start mongodb-indexing-demo-27018
```

---

## 7. Chạy ứng dụng

Cần chạy đủ 3 thành phần:

1. MongoDB.
2. Backend Express.
3. Frontend React.

### Terminal 1: MongoDB

Nếu dùng Docker Compose:

```bash
docker compose up -d
```

Nếu dùng container port `27018`:

```bash
docker start mongodb-indexing-demo-27018
```

### Terminal 2: Backend

```bash
npm --prefix backend run dev
```

Backend chạy tại:

```text
http://localhost:5000
```

Kiểm tra API:

```text
http://localhost:5000/api/health
```

Kết quả đúng:

```json
{
  "success": true,
  "message": "MERN MongoDB benchmark API is running"
}
```

### Terminal 3: Frontend

```bash
npm --prefix frontend run dev
```

Frontend chạy tại:

```text
http://localhost:5173
```

Mở trình duyệt:

```text
http://localhost:5173/shop
```

### Chạy backend + frontend cùng lúc

Có thể dùng:

```bash
npm run dev
```

Nhưng vẫn phải bật MongoDB trước.

---

## 8. Seed dữ liệu

### Seed bằng CLI

```bash
npm --prefix backend run seed
```

Mặc định seed:

| Collection | Số lượng |
|---|---:|
| products | 30,000 |
| orders | 80,000 |
| users | 10,000 |

### Seed bằng UI

1. Mở `http://localhost:5173/dataset`.
2. Bấm `Seed Medium`.
3. Đợi hoàn tất.

### Clear data

CLI:

```bash
npm --prefix backend run clear
```

Hoặc vào `/dataset` bấm `Clear Data`.

---

## 9. Dữ liệu lấy từ đâu?

Dữ liệu không lấy từ API ngoài. Tất cả được sinh giả lập bằng `@faker-js/faker` và lưu vào MongoDB local.

File seed chính:

```text
backend/src/services/seed.service.js
```

Sản phẩm được tạo từ template như:

- iPhone 15 Pro Max
- Samsung Galaxy S24 Ultra
- Dell XPS 13
- Asus ROG Zephyrus G14
- Apple Watch Series 9
- Sony WH-1000XM5
- Logitech MX Master 3S

Ảnh sản phẩm dùng placeholder:

```text
https://picsum.photos/seed/product-{index}/600/420
```

---

## 10. Demo flow đề xuất

### Flow nhanh cho thuyết trình

1. Mở `/shop`.
2. Search `iphone`.
3. Hiển thị số kết quả và performance metrics.
4. Mở `/indexes`.
5. Drop all custom indexes để chuẩn bị baseline.
6. Mở `/benchmark`.
7. Chạy query baseline.
8. Quay lại `/indexes`, tạo index phù hợp.
9. Chạy lại benchmark optimized.
10. Mở `/compare` để xem before/after.
11. Mở `/strategy-comparison` để so sánh nhiều strategy.
12. Mở `/ai-index-advisor` để xem gợi ý index.
13. Mở `/explain/PRODUCTS_BY_CATEGORY` để xem raw execution plan.

### Query demo nên dùng

Nên chọn các query cải thiện rõ:

| Query | Lý do demo tốt |
|---|---|
| `ORDERS_BY_USER_HISTORY` | Compound index theo `userId + createdAt` cải thiện rất mạnh |
| `ORDERS_BY_STATUS_DATE` | Query status/date thực tế trong e-commerce |
| `PRODUCTS_BY_CATEGORY_SORT_PRICE` | Demo filter + sort bằng compound index |
| `SHOP_ACTIVE_NEWEST` | Demo active product + newest sort |

Không nên chọn `PRODUCTS_BY_CATEGORY` làm demo chính vì field `category` có selectivity thấp, thời gian có thể không giảm rõ dù docs examined giảm.

---

## 11. Quản lý index

Trang UI:

```text
http://localhost:5173/indexes
```

### Tạo tất cả index bằng CLI

```bash
npm --prefix backend run index:create
```

### Drop tất cả custom index

```bash
npm --prefix backend run index:drop
```

Lưu ý: hệ thống không xóa index mặc định `_id_`.

### Một số index strategy

| Strategy | Index |
|---|---|
| `PRODUCT_CATEGORY` | `{ category: 1 }` |
| `PRODUCT_CATEGORY_PRICE` | `{ category: 1, price: 1 }` |
| `PRODUCT_ESR` | `{ category: 1, rating: -1, price: 1 }` |
| `PRODUCT_TEXT_SEARCH` | `{ name: "text", brand: "text", description: "text", tags: "text" }` |
| `ORDER_STATUS_DATE` | `{ status: 1, createdAt: -1 }` |
| `ORDER_USER_HISTORY` | `{ userId: 1, createdAt: -1 }` |
| `BENCHMARK_TTL` | `{ createdAt: 1 }` TTL 7 ngày |

---

## 12. Chạy benchmark

### Benchmark baseline

```bash
npm --prefix backend run index:drop
npm --prefix backend run benchmark:baseline
```

### Benchmark optimized

```bash
npm --prefix backend run index:create
npm --prefix backend run benchmark:optimized
```

### Chạy benchmark từ UI

1. Mở `/benchmark`.
2. Chọn query.
3. Nhập strategy.
4. Chọn iterations.
5. Bấm `Run`.

### Kết quả benchmark lưu ở đâu?

Trong MongoDB collection:

```text
benchmarkruns
```

File kết quả đã export:

```text
report/benchmark-results.csv
report/DEMO_RESULTS.md
```

---

## 13. Chạy strategy comparison

Trang UI:

```text
http://localhost:5173/strategy-comparison
```

Chức năng:

- Chọn query.
- Chọn nhiều index strategy.
- Chạy comparison.
- Xem chart:
  - Execution time.
  - Docs examined.
  - Keys examined.
  - Docs examined per returned.
- Xem bảng kết quả đầy đủ.

API liên quan:

```text
POST /api/benchmark/run-matrix
GET  /api/benchmark/matrix-history
GET  /api/benchmark/export-extended-csv
```

CSV mở rộng:

```text
report/benchmark-results-extended.csv
```

---

## 14. AI Index Advisor

Trang UI:

```text
http://localhost:5173/ai-index-advisor
```

Chức năng:

- Chọn query.
- Xem execution plan hiện tại.
- Xem current indexes.
- Rule-based advisor gợi ý index.
- Xem reasoning và trade-off.
- Chạy validation benchmark.

AI Advisor hiện là **rule-based**, không cần API key.  
Nó không tự động thay MongoDB optimizer và không tự ý tạo index. Mọi đề xuất cần được benchmark kiểm chứng.

API liên quan:

```text
POST /api/ai-advisor/analyze
POST /api/ai-advisor/validate
GET  /api/ai-advisor/history
```

---

## 15. ML Index Advisor optional

Thư mục:

```text
ml-index-advisor/
```

Mục đích:

- Dùng CSV benchmark mở rộng.
- Train Random Forest để dự đoán `avgExecutionTimeMillis`.
- Hỗ trợ ranking index strategy.

Cài Python packages:

```bash
cd ml-index-advisor
pip install -r requirements.txt
```

Train model:

```bash
python train_model.py
```

Predict:

```bash
python predict.py
```

Lưu ý: phần ML là mở rộng nghiên cứu, không bắt buộc để chạy web.

---

## 16. API backend quan trọng

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard/summary` | Tổng quan dashboard |
| POST | `/api/seed` | Seed data |
| DELETE | `/api/seed` | Clear data |
| GET | `/api/seed/status` | Xem số lượng dữ liệu |
| GET | `/api/shop/products` | Search/filter/sort products |
| GET | `/api/shop/products/:id` | Product detail |
| POST | `/api/shop/search/compare` | Compare search regex/text |
| GET | `/api/indexes` | List indexes |
| POST | `/api/indexes/create` | Create index strategy |
| DELETE | `/api/indexes/drop-all-custom` | Drop all custom indexes |
| GET | `/api/benchmark/queries` | List benchmark queries |
| POST | `/api/benchmark/run-one` | Run one benchmark |
| POST | `/api/benchmark/run-all` | Run all benchmark |
| POST | `/api/benchmark/run-matrix` | Run matrix benchmark |
| GET | `/api/benchmark/export/csv` | Export basic CSV |
| GET | `/api/benchmark/export-extended-csv` | Export extended CSV |
| GET | `/api/explain/:queryKey` | Explain plan |
| POST | `/api/ai-advisor/analyze` | Analyze query and suggest index |

---

## 17. Các file báo cáo

| File | Nội dung |
|---|---|
| `report/IE213.Q22_Seminar_NguyenNhatMinh_Report.md` | Báo cáo seminar chính |
| `report/TEST_PLAN.md` | Kế hoạch và kết quả test |
| `report/API_TEST_RESULTS.md` | Kết quả test API |
| `report/UI_TEST_RESULTS.md` | Kết quả test frontend routes |
| `report/DEMO_RESULTS.md` | Kết quả benchmark demo |
| `report/benchmark-results.csv` | CSV benchmark before/after |
| `report/benchmark-results-extended.csv` | CSV benchmark matrix |
| `report/SUBMISSION_CHECKLIST.md` | Checklist nộp bài |

---

## 18. Lỗi thường gặp và cách sửa

### 18.1. Frontend báo `Network Error`

Nguyên nhân thường gặp:

- Backend chưa chạy.
- MongoDB chưa chạy.
- Backend không connect được MongoDB.
- Sai `MONGO_URI` trong `backend/.env`.

Cách kiểm tra:

```bash
curl http://localhost:5000/api/health
```

Nếu không được, chạy backend:

```bash
npm --prefix backend run dev
```

Kiểm tra MongoDB:

```bash
docker ps
```

Nếu dùng port `27018`:

```bash
docker start mongodb-indexing-demo-27018
```

### 18.2. Port `27017` bị chiếm

Chạy MongoDB ở port `27018`:

```bash
docker run -d --name mongodb-indexing-demo-27018 -p 27018:27017 mongo:7
```

Sửa `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27018/mern_indexing_benchmark
```

### 18.3. Text search lỗi

Nếu dùng `searchMode=text` mà MongoDB báo lỗi text index, tạo text index trước:

```bash
npm --prefix backend run index:create
```

Hoặc vào `/indexes`, tạo `PRODUCT_TEXT_SEARCH`.

### 18.4. Benchmark baseline không đúng

Đảm bảo đã drop custom index trước:

```bash
npm --prefix backend run index:drop
```

Và trong `.env` có:

```env
MONGOOSE_AUTO_INDEX=false
```

### 18.5. Frontend build warning chunk lớn

Nếu build hiện warning Recharts chunk lớn, có thể bỏ qua cho demo seminar. Warning này không làm app lỗi.

---

## 19. Lệnh nhanh hay dùng

```bash
# Start MongoDB Docker Compose
docker compose up -d

# Start MongoDB demo port 27018
docker start mongodb-indexing-demo-27018

# Install all dependencies
npm install
npm run install:all

# Run backend
npm --prefix backend run dev

# Run frontend
npm --prefix frontend run dev

# Run both backend + frontend
npm run dev

# Seed data
npm --prefix backend run seed

# Clear data
npm --prefix backend run clear

# Create indexes
npm --prefix backend run index:create

# Drop custom indexes
npm --prefix backend run index:drop

# Baseline benchmark
npm --prefix backend run benchmark:baseline

# Optimized benchmark
npm --prefix backend run benchmark:optimized

# Build frontend
npm --prefix frontend run build
```

---

## 20. Kết quả benchmark demo nổi bật

Dataset demo:

| Collection | Documents |
|---|---:|
| products | 30,000 |
| orders | 80,000 |
| users | 10,000 |

Một số kết quả nổi bật:

| Query | Before | After | Faster | Docs Reduced |
|---|---:|---:|---:|---:|
| `ORDERS_BY_USER_HISTORY` | 90.8ms | 0.4ms | 227x | 99.99% |
| `ORDERS_BY_STATUS_DATE` | 124.8ms | 3.6ms | 34.67x | 99.38% |
| `PRODUCTS_BY_CATEGORY_SORT_PRICE` | 28.2ms | 2.8ms | 10.07x | 98.33% |
| `SHOP_ACTIVE_NEWEST` | 79.8ms | 2ms | 39.9x | 98.33% |

Kết luận: các query có filter + sort hoặc truy vấn theo user/date hưởng lợi rõ nhất từ compound index.

---

## 21. Strict MERN boundary

Project tuân thủ MERN:

- MongoDB: lưu dữ liệu, index, execution plan, benchmark results.
- Express.js: REST API backend.
- React Vite: frontend SPA.
- Node.js: runtime backend và scripts.

Không dùng:

- Next.js.
- NestJS.
- GraphQL.
- Prisma.
- Kafka.
- Redis.
- Kubernetes.
- Microservices.

---

## 22. GitHub

Repository:

```text
https://github.com/Minwsun/seminar-ie212
```
