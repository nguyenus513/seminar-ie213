import { useEffect, useMemo, useState } from "react";
import { indexApi } from "../api/indexApi";

export default function IndexManagementPage() {
  const [strategies, setStrategies] = useState({}); const [indexes, setIndexes] = useState([]); const [loading, setLoading] = useState(false);
  async function refresh() { const [s, i] = await Promise.all([indexApi.strategies(), indexApi.list()]); setStrategies(s); setIndexes(i); }
  useEffect(() => { refresh(); }, []);
  const existing = useMemo(() => new Set(indexes.flatMap((item) => item.indexes.map((index) => index.name))), [indexes]);
  async function action(fn) { setLoading(true); try { await fn(); await refresh(); } finally { setLoading(false); } }
  return <div className="space-y-6"><div className="flex justify-between gap-4"><div><h2 className="text-3xl font-black">Index Management</h2><p className="text-slate-400">Tạo/xóa index thật trong MongoDB, giữ nguyên _id_.</p></div><button className="btn-muted" onClick={() => action(indexApi.dropAll)} disabled={loading}>Drop All Custom</button></div><div className="grid gap-4 lg:grid-cols-2">{Object.entries(strategies).map(([key, item]) => <div key={key} className="glass rounded-2xl p-5"><div className="flex justify-between gap-3"><div><div className="text-xs text-accent">{item.collection}</div><h3 className="font-bold">{key}</h3><p className="text-sm text-slate-400">{item.name}</p></div><span className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${existing.has(item.options.name) ? "bg-accent/10 text-accent" : "bg-warn/10 text-warn"}`}>{existing.has(item.options.name) ? "Created" : "Missing"}</span></div><pre className="mt-4 overflow-auto rounded-xl bg-black/30 p-3 text-xs text-slate-300">{JSON.stringify({ index: item.index, options: item.options }, null, 2)}</pre><button className="btn mt-4" disabled={loading} onClick={() => action(() => indexApi.create(key))}>Create Index</button></div>)}</div></div>;
}
