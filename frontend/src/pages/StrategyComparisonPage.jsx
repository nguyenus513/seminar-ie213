import { useEffect, useMemo, useState } from "react";
import SimpleBarChart from "../components/charts/SimpleBarChart";
import RawJsonViewer from "../components/explain/RawJsonViewer";
import { benchmarkApi } from "../api/benchmarkApi";

export default function StrategyComparisonPage() {
  const [queries, setQueries] = useState([]);
  const [queryKey, setQueryKey] = useState("PRODUCTS_CATEGORY_SORT_PRICE");
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentQuery = useMemo(() => queries.find((item) => item.queryKey === queryKey), [queries, queryKey]);
  const rows = result?.results?.filter((item) => !item.error) || [];

  useEffect(() => {
    benchmarkApi.matrixQueries().then((items) => {
      setQueries(items);
      const first = items.find((item) => item.queryKey === "PRODUCTS_CATEGORY_SORT_PRICE") || items[0];
      if (first) {
        setQueryKey(first.queryKey);
        setSelected(first.strategies || []);
      }
    });
  }, []);

  function toggleStrategy(strategy) {
    setSelected((current) => current.includes(strategy) ? current.filter((item) => item !== strategy) : [...current, strategy]);
  }

  async function run() {
    setLoading(true);
    try {
      setResult(await benchmarkApi.runMatrix({ queryKey, strategies: selected, iterations: 5, limit: 500, datasetLabel: "30k_products_80k_orders_10k_users" }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-black">Index Strategy Comparison</h2><p className="text-slate-400">So sánh nhiều chiến lược index bằng hint() và explain executionStats.</p></div>
      <div className="glass rounded-2xl p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <select className="input md:col-span-2" value={queryKey} onChange={(e) => { const next = queries.find((item) => item.queryKey === e.target.value); setQueryKey(e.target.value); setSelected(next?.strategies || []); }}>
            {queries.map((item) => <option key={item.queryKey}>{item.queryKey}</option>)}
          </select>
          <button className="btn" disabled={loading || !selected.length} onClick={run}>{loading ? "Running..." : "Run Comparison"}</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(currentQuery?.strategies || []).map((strategy) => <button key={strategy} onClick={() => toggleStrategy(strategy)} className={selected.includes(strategy) ? "btn" : "btn-muted"}>{strategy}</button>)}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-4"><SimpleBarChart data={rows} dataKey="avgExecutionTimeMillis" name="Execution Time" /><SimpleBarChart data={rows} dataKey="avgDocsExamined" name="Docs Examined" color="#F5B14C" /><SimpleBarChart data={rows} dataKey="avgKeysExamined" name="Keys Examined" color="#60A5FA" /><SimpleBarChart data={rows} dataKey="docsExaminedPerReturned" name="Docs / Returned" color="#F472B6" /></div>
      <div className="overflow-auto rounded-2xl border border-line"><table className="min-w-full text-sm"><thead className="bg-white/5 text-left"><tr>{["Strategy", "Stage", "Index", "Avg ms", "Docs", "Keys", "Returned", "Docs/Returned", "Sort", "Covered"].map((h) => <th className="px-4 py-3" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={`${row.queryKey}-${row.strategyKey}`} className="border-t border-line"><td className="px-4 py-3 font-bold">{row.strategyKey}</td><td className="px-4 py-3">{row.stage}</td><td className="px-4 py-3">{row.indexName || "none"}</td><td className="px-4 py-3">{row.avgExecutionTimeMillis}</td><td className="px-4 py-3">{row.avgDocsExamined}</td><td className="px-4 py-3">{row.avgKeysExamined}</td><td className="px-4 py-3">{row.avgReturned}</td><td className="px-4 py-3">{row.docsExaminedPerReturned}</td><td className="px-4 py-3">{String(row.hasSortStage)}</td><td className="px-4 py-3">{String(row.isCoveredQuery)}</td></tr>)}</tbody></table></div>
      {result && <RawJsonViewer data={result} />}
    </div>
  );
}
