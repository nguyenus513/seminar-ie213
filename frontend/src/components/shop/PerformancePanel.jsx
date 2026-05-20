function Metric({ label, value }) {
  return <div className="rounded-xl bg-black/30 p-3"><div className="text-xs text-slate-400">{label}</div><div className="mt-1 truncate font-bold text-white">{value ?? "-"}</div></div>;
}

export default function PerformancePanel({ performance }) {
  if (!performance) return null;
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="mb-3 font-bold">Query Performance</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="API Time" value={`${performance.apiResponseTimeMs}ms`} />
        <Metric label="MongoDB Time" value={`${performance.mongoExecutionTimeMillis}ms`} />
        <Metric label="Stage" value={performance.stage} />
        <Metric label="Index" value={performance.indexUsed || "None"} />
        <Metric label="Docs Examined" value={performance.totalDocsExamined?.toLocaleString("vi-VN")} />
        <Metric label="Keys Examined" value={performance.totalKeysExamined?.toLocaleString("vi-VN")} />
        <Metric label="Returned" value={performance.nReturned} />
        <Metric label="Count Time" value={`${performance.countTimeMillis}ms`} />
      </div>
    </div>
  );
}
