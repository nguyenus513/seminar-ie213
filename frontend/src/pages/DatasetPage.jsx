import { useEffect, useState } from "react";
import MetricCard from "../components/cards/MetricCard";
import { seedApi } from "../api/seedApi";

export default function DatasetPage() {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(false);
  async function refresh() { setData(await seedApi.status()); }
  async function run(action) { setLoading(true); try { setData(await action()); } finally { setLoading(false); } }
  useEffect(() => { refresh(); }, []);
  return <div className="space-y-6"><div><h2 className="text-3xl font-black">Dataset</h2><p className="text-slate-400">Seed dữ liệu lớn giả lập cho benchmark MongoDB.</p></div><div className="flex flex-wrap gap-3"><button disabled={loading} className="btn" onClick={() => run(() => seedApi.seed({ products: 30000, orders: 80000, users: 10000 }))}>Seed Medium</button><button disabled={loading} className="btn-muted" onClick={() => run(seedApi.clear)}>Clear Data</button><button className="btn-muted" onClick={refresh}>Refresh</button></div><div className="grid gap-4 md:grid-cols-3"><MetricCard label="Products" value={data?.products?.toLocaleString()} /><MetricCard label="Orders" value={data?.orders?.toLocaleString()} /><MetricCard label="Users" value={data?.users?.toLocaleString()} /></div></div>;
}
