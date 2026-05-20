import { useEffect, useState } from "react";
import SimpleBarChart from "../components/charts/SimpleBarChart";
import RawJsonViewer from "../components/explain/RawJsonViewer";
import { benchmarkApi } from "../api/benchmarkApi";

export default function ComparePage() {
  const [data, setData] = useState([]); useEffect(() => { benchmarkApi.compare().then(setData); }, []);
  const chart = data.map((item) => ({ queryKey: item.queryKey, before: item.baseline.avgExecutionTimeMillis, after: item.optimized.avgExecutionTimeMillis, fasterRatio: item.improvement.fasterRatio, docsReductionPercent: item.improvement.docsReductionPercent }));
  return <div className="space-y-6"><h2 className="text-3xl font-black">Compare</h2><div className="overflow-auto rounded-2xl border border-line"><table className="min-w-full text-sm"><thead className="bg-white/5 text-left"><tr>{["Query", "Before", "After", "Faster", "Docs Reduced", "Stages"].map((h) => <th className="px-4 py-3" key={h}>{h}</th>)}</tr></thead><tbody>{data.map((item) => <tr key={item.queryKey} className="border-t border-line"><td className="px-4 py-3 font-bold">{item.queryKey}</td><td className="px-4 py-3">{item.baseline.avgExecutionTimeMillis}ms</td><td className="px-4 py-3">{item.optimized.avgExecutionTimeMillis}ms</td><td className="px-4 py-3">{item.improvement.fasterRatio}x</td><td className="px-4 py-3">{item.improvement.docsReductionPercent}%</td><td className="px-4 py-3">{item.baseline.stage} → {item.optimized.stage}</td></tr>)}</tbody></table></div><div className="grid gap-4 lg:grid-cols-2"><SimpleBarChart data={chart} dataKey="fasterRatio" name="Faster Ratio" /><SimpleBarChart data={chart} dataKey="docsReductionPercent" name="Docs Reduction %" color="#F5B14C" /></div><RawJsonViewer data={data} /></div>;
}
