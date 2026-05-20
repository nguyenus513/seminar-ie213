function average(items, key) {
  const values = items.map((item) => Number(item[key] || 0));
  if (!values.length) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100;
}

function min(items, key) {
  return items.length ? Math.min(...items.map((item) => Number(item[key] || 0))) : 0;
}

function max(items, key) {
  return items.length ? Math.max(...items.map((item) => Number(item[key] || 0))) : 0;
}

module.exports = { average, min, max };
