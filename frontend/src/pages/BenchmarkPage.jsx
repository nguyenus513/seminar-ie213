import { useEffect, useMemo, useState } from "react";
import BenchmarkTable from "../components/tables/BenchmarkTable";
import SimpleBarChart from "../components/charts/SimpleBarChart";
import RawJsonViewer from "../components/explain/RawJsonViewer";
import { benchmarkApi } from "../api/benchmarkApi";

const initialForm = {
  queryKey: "PRODUCTS_BY_CATEGORY",
  strategyKey: "NO_INDEX",
  mode: "baseline",
  iterations: 5,
  limit: 500,
  saveLog: true
};

export default function BenchmarkPage() {
  const [queries, setQueries] = useState({});
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    benchmarkApi.queries().then(setQueries);
  }, []);

  const selectedQuery = queries[form.queryKey];
  const strategyOptions = useMemo(() => {
    const options = ["NO_INDEX", selectedQuery?.recommendedStrategy].filter(Boolean);
    return [...new Set(options)];
  }, [selectedQuery]);

  function updateQuery(queryKey) {
    const nextQuery = queries[queryKey];
    setForm((current) => ({
      ...current,
      queryKey,
      strategyKey: current.mode === "optimized" ? nextQuery?.recommendedStrategy || current.strategyKey : "NO_INDEX"
    }));
  }

  function updateMode(mode) {
    setForm((current) => ({
      ...current,
      mode,
      strategyKey: mode === "optimized" ? selectedQuery?.recommendedStrategy || current.strategyKey : mode === "baseline" ? "NO_INDEX" : current.strategyKey
    }));
  }

  async function run() {
    setLoading(true);
    setError("");
    try {
      setResult(await benchmarkApi.runOne(form));
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  const rows = result ? [result] : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black">Benchmark</h2>
        <p className="text-slate-400">Chạy explain executionStats nhiều iterations và lưu BenchmarkRun.</p>
      </div>
      <div className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-6">
        <select className="input md:col-span-2" value={form.queryKey} onChange={(event) => updateQuery(event.target.value)}>
          {Object.keys(queries).map((key) => <option key={key}>{key}</option>)}
        </select>
        <select className="input" value={form.mode} onChange={(event) => updateMode(event.target.value)}>
          <option value="baseline">baseline</option>
          <option value="optimized">optimized</option>
          <option value="custom">custom</option>
        </select>
        <select className="input" value={form.strategyKey} onChange={(event) => setForm({ ...form, strategyKey: event.target.value })}>
          {strategyOptions.map((key) => <option key={key}>{key}</option>)}
        </select>
        <input className="input" type="number" min="1" value={form.iterations} onChange={(event) => setForm({ ...form, iterations: Number(event.target.value) })} />
        <button className="btn" disabled={loading} onClick={run}>{loading ? "Running..." : "Run"}</button>
      </div>
      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
      <BenchmarkTable rows={rows} />
      <div className="grid gap-4 lg:grid-cols-3">
        <SimpleBarChart data={rows} dataKey="avgExecutionTimeMillis" name="Execution Time" />
        <SimpleBarChart data={rows} dataKey="avgDocsExamined" name="Docs Examined" color="#F5B14C" />
        <SimpleBarChart data={rows} dataKey="avgKeysExamined" name="Keys Examined" color="#60A5FA" />
      </div>
      {result && <RawJsonViewer data={result.rawExplain?.queryPlanner?.winningPlan || result} />}
    </div>
  );
}
