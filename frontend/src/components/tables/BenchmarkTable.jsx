export default function BenchmarkTable({ rows = [] }) {
  return (
    <div className="overflow-auto rounded-2xl border border-line">
      <table className="min-w-full divide-y divide-line text-sm">
        <thead className="bg-white/5 text-left text-slate-300">
          <tr>{["Query", "Strategy", "Stage", "Avg Time", "Docs", "Keys", "Returned"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row, index) => (
            <tr key={row.id || index} className="bg-black/10">
              <td className="px-4 py-3 font-semibold">{row.queryName || row.queryKey}</td>
              <td className="px-4 py-3 text-slate-300">{row.strategyName || row.indexStrategy}</td>
              <td className="px-4 py-3"><span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-bold text-accent">{row.stage}</span></td>
              <td className="px-4 py-3">{row.avgExecutionTimeMillis ?? row.summary?.avgExecutionTimeMillis}ms</td>
              <td className="px-4 py-3">{(row.avgDocsExamined ?? row.summary?.avgDocsExamined)?.toLocaleString?.()}</td>
              <td className="px-4 py-3">{(row.avgKeysExamined ?? row.summary?.avgKeysExamined)?.toLocaleString?.()}</td>
              <td className="px-4 py-3">{(row.avgReturned ?? row.summary?.avgReturned)?.toLocaleString?.()}</td>
            </tr>
          ))}
          {!rows.length && <tr><td className="px-4 py-8 text-center text-slate-500" colSpan="7">No data yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
