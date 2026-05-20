# API Test Results - 2026-05-17

| Test | Status | Note |
|---|---|---|
| Health API | PASS | {"success":true,"message":"MERN MongoDB benchmark API is running"} |
| Seed status | PASS | {"success":true,"message":"OK","data":{"products":30000,"orders":80000,"users":10000,"benchmarkRuns":0,"searchLogs":1}} |
| Dashboard summary | PASS | {"success":true,"message":"OK","data":{"products":30000,"orders":80000,"users":10000,"customIndexes":16,"latestBenchmark":null,"latestSearch":{"_id":"6a0993515ad09bdeb821051b","key |
| Indexes list | PASS | {"success":true,"message":"OK","data":[{"collection":"products","indexes":[{"v":2,"key":{"_id":1},"name":"_id_"},{"v":2,"key":{"category":1},"name":"idx_product_category"},{"v":2," |
| Benchmark queries | PASS | {"success":true,"message":"OK","data":{"PRODUCTS_BY_CATEGORY":{"label":"Products by Category","collection":"products","filter":{"category":"phone"},"sort":null,"recommendedStrategy |
| Matrix queries | PASS | {"success":true,"message":"OK","data":[{"queryKey":"PRODUCTS_CATEGORY","queryName":"Products by Category","collection":"products","filter":{"category":"phone"},"strategies":["NO_IN |
| Benchmark history | PASS | {"success":true,"message":"OK","data":[]} |
| Matrix history | PASS | {"success":true,"message":"OK","data":[{"_id":"6a098dcb6a310c735a545017","datasetLabel":"30k_products_80k_orders_10k_users","queryKey":"SHOP_TEXT_SEARCH","queryName":"Shop Text Sea |
| Explain products category | PASS | {"success":true,"message":"OK","data":{"executionTimeMillis":3,"totalDocsExamined":500,"totalKeysExamined":500,"nReturned":500,"stage":"FETCH","indexName":"idx_product_category","h |
| Shop products | PASS | {"success":true,"message":"OK","data":{"data":[{"_id":"69fc4ae0b64b52af73f9eb33","name":"iPhone 14 64GB Blue","slug":"iphone-14-64gb-blue-13521","category":"phone","brand":"Apple", |
| AI Advisor analyze | PASS | {"success":true,"message":"Advisor analysis completed","data":{"id":"6a0993645ad09bdeb8210554","queryKey":"PRODUCTS_BY_CATEGORY_SORT_PRICE","queryShape":{"collection":"products","f |