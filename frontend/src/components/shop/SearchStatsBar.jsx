export default function SearchStatsBar({ pagination, performance }) {
  if (!pagination || !performance) return null;
  return (
    <div className="text-sm text-slate-400">
      Tìm thấy khoảng <span className="font-bold text-white">{pagination.totalResults.toLocaleString("vi-VN")}</span> sản phẩm trong <span className="font-bold text-white">{performance.apiResponseTimeMs}ms</span>
      <span className="ml-2 text-slate-500">MongoDB: {performance.mongoExecutionTimeMillis}ms</span>
    </div>
  );
}
