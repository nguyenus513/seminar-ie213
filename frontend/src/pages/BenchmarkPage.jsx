import { useEffect, useState } from "react";
import BenchmarkTable from "../components/tables/BenchmarkTable";
import SimpleBarChart from "../components/charts/SimpleBarChart";
import RawJsonViewer from "../components/explain/RawJsonViewer";
import { benchmarkApi } from "../api/benchmarkApi";

export default function BenchmarkPage() {
  const [queries, setQueries] = useState({}); const [form, setForm] = useState({ queryKey: "PRODUCTS_BY_CATEGORY", strategyKey: "NO_INDEX", mode: "baseline", iterations: 5, limit: 500, saveLog: true }); const [result, setResult] = useState(null); const [loading, setLoading] = useState(false);
  useEffect(() => { benchmarkApi.queries().then(setQueries); }, []);
  async function run() { setLoading(true); try { setResult(await benchmarkApi.runOne(form)); } finally { setLoading(false); } }
  const rows = result ? [result] : [];
  return <div className="space-y-6"><div><h2 className="text-3xl font-black">Benchmark</h2><p className="text-slate-400">Chạy explain executionStats nhiều iterations và lưu BenchmarkRun.</p></div><div className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-5"><select className="input md:col-span-2" value={form.queryKey} onChange={(e) => setForm({ ...form, queryKey: e.target.value })}>{Object.keys(queries).map((key) => <option key={key}>{key}</option>)}</select><input className="input" value={form.strategyKey} onChange={(e) => setForm({ ...form, strategyKey: e.target.value })} /><input className="input" type="number" value={form.iterations} onChange={(e) => setForm({ ...form, iterations: Number(e.target.value) })} /><button className="btn" disabled={loading} onClick={run}>{loading ? "Running..." : "Run"}</button></div><BenchmarkTable rows={rows} /><div className="grid gap-4 lg:grid-cols-3"><SimpleBarChart data={rows} dataKey="avgExecutionTimeMillis" name="Execution Time" /><SimpleBarChart data={rows} dataKey="avgDocsExamined" name="Docs Examined" color="#F5B14C" /><SimpleBarChart data={rows} dataKey="avgKeysExamined" name="Keys Examined" color="#60A5FA" /></div>{result && <RawJsonViewer data={result.rawExplain?.queryPlanner?.winningPlan || result} />}</div>;
}
