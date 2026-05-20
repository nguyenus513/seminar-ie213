import { useEffect, useState } from "react";
import MetricCard from "../components/cards/MetricCard";
import RawJsonViewer from "../components/explain/RawJsonViewer";
import { dashboardApi } from "../api/dashboardApi";

export default function OverviewPage() {
  const [data, setData] = useState(null);
  useEffect(() => { dashboardApi.summary().then(setData).catch(console.error); }, []);
  return <div className="space-y-6"><div><h2 className="text-3xl font-black">Overview</h2><p className="text-slate-400">Tổng quan dữ liệu, index và benchmark mới nhất.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><MetricCard label="Products" value={data?.products?.toLocaleString()} /><MetricCard label="Orders" value={data?.orders?.toLocaleString()} /><MetricCard label="Users" value={data?.users?.toLocaleString()} /><MetricCard label="Custom Indexes" value={data?.customIndexes} /></div><div className="grid gap-4 lg:grid-cols-2"><MetricCard label="Latest Search" value={data?.latestSearch?.keyword || "-"} hint={data?.latestSearch ? `${data.latestSearch.stage} · ${data.latestSearch.mongoExecutionTimeMillis}ms` : "No search yet"} /><MetricCard label="Latest Benchmark" value={data?.latestBenchmark?.queryKey || "-"} hint={data?.latestBenchmark ? `${data.latestBenchmark.stage} · ${data.latestBenchmark.avgExecutionTimeMillis}ms` : "No benchmark yet"} /></div><RawJsonViewer data={data} /></div>;
}
