# Kế hoạch test hệ thống MERN E-commerce Search Benchmark Dashboard

## 1. Mục tiêu
Kiểm tra hệ thống chạy đúng MERN Stack, seed được dữ liệu lớn, tạo/xóa index MongoDB, chạy benchmark bằng `explain("executionStats")`, hiển thị dashboard và xuất dữ liệu phục vụ báo cáo.

## 2. Môi trường test
| Thành phần | Ghi chú |
|---|---|
| OS | Windows 10/11 |
| Node.js | 20+ |
| Docker | Docker Desktop |
| MongoDB | `mongo:7` qua Docker Compose |
| Backend | `http://localhost:5000` |
| Frontend | `http://localhost:5173` |

## 3. Chuẩn bị
```bash
docker compose up -d
copy backend\.env.example backend\.env
npm install
npm run install:all
npm run dev
```

## 4. Test cases chính
| TC | Chức năng | Bước test | Kết quả kỳ vọng |
|---|---|---|---|
| TC01 | Backend health | Mở `/api/health` | Trả JSON `success: true` |
| TC02 | Frontend | Mở `/shop` | Hiển thị trang search sản phẩm |
| TC03 | Seed data | `/dataset` bấm `Seed Medium` | Có 30k products, 80k orders, 10k users |
| TC04 | Clear data | `/dataset` bấm `Clear Data` | Counts về 0 |
| TC05 | Drop indexes | `/indexes` bấm `Drop All Custom` | Chỉ còn `_id_` |
| TC06 | Create index | Tạo `PRODUCT_CATEGORY`, `PRODUCT_TEXT_SEARCH` | Status chuyển `Created` |
| TC07 | Regex search | `/shop`, `q=iphone`, `searchMode=regex` | Có metrics, thường `COLLSCAN` khi chưa index |
| TC08 | Text search | Tạo `PRODUCT_TEXT_SEARCH`, search `text` | Dùng text index/winning plan có index |
| TC09 | Compare search | Bấm `Compare This Search` | Có baseline, optimized, faster ratio |
| TC10 | Baseline benchmark | Run `PRODUCTS_BY_CATEGORY`, `NO_INDEX` | Lưu benchmark baseline |
| TC11 | Optimized benchmark | Tạo `PRODUCT_CATEGORY`, run optimized | Stage có xu hướng `IXSCAN` |
| TC12 | Compare dashboard | Mở `/compare` | Có before/after, docs reduction |
| TC13 | Explain viewer | Mở `/explain/PRODUCTS_BY_CATEGORY` | Có `winningPlan`, `executionStats` |
| TC14 | History/export | Mở `/history`, export CSV | Tải được CSV |
| TC15 | Cart demo | Add product, mở `/cart` | Cart lưu localStorage |

## 5. Kịch bản đo benchmark cho báo cáo
```bash
npm --prefix backend run seed
npm --prefix backend run index:drop
npm --prefix backend run benchmark:baseline
npm --prefix backend run index:create
npm --prefix backend run benchmark:optimized
```

## 6. Minh chứng cần chụp
- `/shop` regex baseline.
- `/shop` text optimized.
- `/indexes` sau khi tạo index.
- `/benchmark` kết quả đo.
- `/compare` bảng/biểu đồ so sánh.
- `/explain/PRODUCTS_BY_CATEGORY` raw execution plan.
- File CSV từ `/history`.

## 7. Bảng kết quả thực nghiệm cần điền
| Query | Strategy | Stage | Avg Time | Docs Examined | Keys Examined | Improvement |
|---|---|---:|---:|---:|---:|---:|
| PRODUCTS_BY_CATEGORY | NO_INDEX | Chờ đo | Chờ đo | Chờ đo | Chờ đo | 1x |
| PRODUCTS_BY_CATEGORY | PRODUCT_CATEGORY | Chờ đo | Chờ đo | Chờ đo | Chờ đo | Chờ tính |
| PRODUCTS_BY_CATEGORY_SORT_PRICE | NO_INDEX | Chờ đo | Chờ đo | Chờ đo | Chờ đo | 1x |
| PRODUCTS_BY_CATEGORY_SORT_PRICE | PRODUCT_CATEGORY_PRICE | Chờ đo | Chờ đo | Chờ đo | Chờ đo | Chờ tính |
| PRODUCTS_ESR | PRODUCT_ESR | Chờ đo | Chờ đo | Chờ đo | Chờ đo | Chờ tính |

## 8. Tiêu chí đạt
- Chạy được local bằng Docker + npm.
- Seed được dữ liệu lớn.
- Tạo/xóa/list index được.
- Benchmark lấy số liệu từ MongoDB `executionStats`.
- Có dashboard và raw explain plan để đưa vào báo cáo.

# Test Execution Summary - 2026-05-17

## Trạng thái đã chạy

| Hạng mục | Kết quả |
|---|---|
| Backend syntax check | PASS |
| Frontend production build | PASS |
| MongoDB demo container | PASS - dùng `mongodb-indexing-demo-27018` |
| Dataset seed | PASS - `30,000 products`, `80,000 orders`, `10,000 users` |
| Baseline benchmark | PASS - đã có `report/benchmark-results.csv` |
| Optimized benchmark | PASS - đã có before/after trong `report/DEMO_RESULTS.md` |
| Matrix benchmark | PASS - đã có `report/benchmark-results-extended.csv` |
| AI Index Advisor service | PASS - rule-based advisor trả recommendation |

## Matrix benchmark đã chạy

Query: `PRODUCTS_CATEGORY_SORT_PRICE`, iterations = 3, limit = 500.

| Strategy | Stage | Avg ms | Docs Examined | Keys Examined | Docs/Returned | Faster vs NO_INDEX | Docs Reduced |
|---|---|---:|---:|---:|---:|---:|---:|
| NO_INDEX | SORT | 31.33 | 30,000 | 0 | 60 | 1x | 0% |
| PRODUCT_CATEGORY_SINGLE | SORT | 16.67 | 12,000 | 12,000 | 24 | 1.88x | 60% |
| PRODUCT_PRICE_CATEGORY_WRONG_ORDER | FETCH | 2.33 | 1,298 | 1,298 | 2.6 | 13.45x | 95.67% |
| PRODUCT_CATEGORY_PRICE | FETCH | 1 | 500 | 500 | 1 | 31.33x | 98.33% |
| PRODUCT_COVERED_LISTING | FETCH | 0.67 | 500 | 500 | 1 | 46.76x | 98.33% |

## Kết luận test

- Hệ thống core đã test xong ở mức demo/seminar: build được, seed được, benchmark được, export CSV được.
- Before/after benchmark chính đã có số liệu thực nghiệm.
- Matrix benchmark mở rộng đã có số liệu cho query `PRODUCTS_CATEGORY_SORT_PRICE` để chứng minh single index, wrong compound, correct compound và covered listing khác nhau.
- AI Index Advisor đã chạy ở chế độ rule-based, không cần API key.
- Chưa chụp screenshot UI; cần chụp thủ công khi mở app để đưa vào DOCX/PDF.

## Full Test Run - 2026-05-17

### Build/Syntax
- Backend `node --check`: PASS
- Frontend `npm --prefix frontend run build`: PASS
- Warning: Vite chunk size lớn do Recharts, không ảnh hưởng demo.

### API Smoke Test
Xem chi tiết tại `report/API_TEST_RESULTS.md`.

| API group | Status |
|---|---|
| Health | PASS |
| Seed/Dataset | PASS |
| Dashboard summary | PASS |
| Indexes | PASS |
| Benchmark queries/history | PASS |
| Matrix queries/history | PASS |
| Explain plan | PASS |
| Shop products | PASS |
| AI advisor analyze | PASS |

### Frontend Route Test
Xem chi tiết tại `report/UI_TEST_RESULTS.md`.

| Frontend area | Status |
|---|---|
| Shop | PASS |
| Dataset | PASS |
| Indexes | PASS |
| Benchmark | PASS |
| Compare | PASS |
| Strategy Comparison | PASS |
| AI Index Advisor | PASS |
| History | PASS |
| Explain Plan | PASS |

### Benchmark Artifacts
- `report/benchmark-results.csv`: PASS - có before/after benchmark data.
- `report/benchmark-results-extended.csv`: PASS - có matrix benchmark data.
- `report/DEMO_RESULTS.md`: PASS - có bảng tổng hợp demo.

### Limitations
- MCP browser bị treo nên chưa tự động chụp screenshots UI.
- Cần chụp thủ công UI trước khi đóng gói nộp bài.
