import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MetricCard from "../components/cards/MetricCard";
import RawJsonViewer from "../components/explain/RawJsonViewer";
import { benchmarkApi } from "../api/benchmarkApi";

export default function ExplainPlanPage() {
  const { queryKey } = useParams(); const [data, setData] = useState(null);
  useEffect(() => { benchmarkApi.explain(queryKey).then(setData).catch(console.error); }, [queryKey]);
  return <div className="space-y-6"><h2 className="text-3xl font-black">Explain Plan: {queryKey}</h2><div className="grid gap-4 md:grid-cols-4"><MetricCard label="Stage" value={data?.stage} /><MetricCard label="Execution" value={data?.executionTimeMillis != null ? `${data.executionTimeMillis}ms` : "-"} /><MetricCard label="Docs Examined" value={data?.totalDocsExamined?.toLocaleString()} /><MetricCard label="Index" value={data?.indexName || "None"} /></div><div className="grid gap-4 lg:grid-cols-2"><RawJsonViewer data={data?.winningPlan} /><RawJsonViewer data={data?.executionStats} /></div></div>;
}
