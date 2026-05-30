from pathlib import Path
from playwright.sync_api import sync_playwright

base = 'http://localhost:5173'
out = Path('report/screenshots')
out.mkdir(parents=True, exist_ok=True)
pages = [
    ('shop', '/shop', 'Search Product Benchmark'),
    ('dataset', '/dataset', 'Dataset'),
    ('indexes', '/indexes', 'Index Management'),
    ('benchmark', '/benchmark', 'Benchmark'),
    ('compare', '/compare', 'Compare'),
    ('strategy-comparison', '/strategy-comparison', 'Index Strategy Comparison'),
    ('ai-index-advisor', '/ai-index-advisor', 'AI Index Advisor'),
    ('history', '/history', 'History'),
    ('explain', '/explain/PRODUCTS_BY_CATEGORY', 'Explain Plan'),
]
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1100})
    for name, path, expected in pages:
        try:
            page.goto(base + path, wait_until='networkidle', timeout=60000)
            page.wait_for_timeout(1200)
            ok = expected.lower() in page.text_content('body').lower()
            page.screenshot(path=str(out / f'{name}.png'), full_page=True)
            results.append((name, 'PASS' if ok else 'WARN', path))
        except Exception as exc:
            results.append((name, 'FAIL', str(exc).replace('\n',' ')[:180]))
    browser.close()

Path('report/UI_TEST_RESULTS.md').write_text('\n'.join([
    '# UI Test Results - 2026-05-17',
    '',
    '| Page | Status | Note |',
    '|---|---|---|',
    *[f'| {name} | {status} | {note} |' for name, status, note in results],
    '',
    'Screenshots saved in `report/screenshots/`.'
]), encoding='utf-8')
print(results)
