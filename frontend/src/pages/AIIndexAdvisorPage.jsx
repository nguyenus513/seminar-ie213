import { useEffect, useState } from "react";
import RawJsonViewer from "../components/explain/RawJsonViewer";
import MetricCard from "../components/cards/MetricCard";
import { benchmarkApi } from "../api/benchmarkApi";
import { aiAdvisorApi } from "../api/aiAdvisorApi";

export default function AIIndexAdvisorPage() {
  const [queries, setQueries] = useState({});
  const [queryKey, setQueryKey] = useState("PRODUCTS_BY_CATEGORY_SORT_PRICE");
  const [analysis, setAnalysis] = useState(null);
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { benchmarkApi.queries().then(setQueries); }, []);

  async function analyze() {
    setLoading(true);
    try { setAnalysis(await aiAdvisorApi.analyze({ queryKey, limit: 500 })); setValidation(null); }
    finally { setLoading(false); }
  }

  async function validate(strategyKey) {
    setLoading(true);
    try { setValidation(await aiAdvisorApi.validate({ logId: analysis?.id, queryKey: queryKey.replace("PRODUCTS_BY_CATEGORY_SORT_PRICE", "PRODUCTS_CATEGORY_SORT_PRICE"), strategyKey, iterations: 5, limit: 500 })); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-black">AI Index Advisor</h2><p className="text-slate-400">Rule-based advisor phân tích query pattern, execution plan và đề xuất index. AI không tự tạo index; mọi đề xuất cần benchmark validation.</p></div>
      <div className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-3"><select className="input md:col-span-2" value={queryKey} onChange={(e) => setQueryKey(e.target.value)}>{Object.keys(queries).map((key) => <option key={key}>{key}</option>)}</select><button className="btn" disabled={loading} onClick={analyze}>{loading ? "Analyzing..." : "Analyze"}</button></div>
      {analysis && <><div className="grid gap-4 md:grid-cols-4"><MetricCard label="Advisor Mode" value={analysis.advisorMode} /><MetricCard label="Stage" value={analysis.currentStats?.stage} /><MetricCard label="Docs Examined" value={analysis.currentStats?.totalDocsExamined?.toLocaleString()} /><MetricCard label="Risk" value={analysis.riskLevel} /></div><div className="grid gap-4 lg:grid-cols-2"><div className="glass rounded-2xl p-5"><h3 className="mb-4 font-bold">Suggested Indexes</h3><div className="space-y-3">{analysis.recommendations.map((item, index) => <div key={index} className="rounded-xl border border-line bg-black/20 p-4"><div className="text-sm font-bold text-accent">{item.type}</div><pre className="mt-2 overflow-auto text-xs text-slate-200">{JSON.stringify(item.index, null, 2)}</pre><p className="mt-2 text-sm text-slate-300">{item.reason}</p><button onClick={() => validate(item.type === "text" ? "PRODUCT_TEXT_SEARCH" : item.type === "covered-query" ? "PRODUCT_COVERED_LISTING" : item.type === "compound-esr" ? "PRODUCT_CATEGORY_PRICE" : "PRODUCT_CATEGORY_SINGLE")} className="btn-muted mt-3">Run Validation Benchmark</button></div>)}</div></div><div className="glass rounded-2xl p-5"><h3 className="mb-3 font-bold">Reasoning & Trade-off</h3><ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">{[...(analysis.reasoning || []), ...(analysis.tradeOffs || []), ...(analysis.validationPlan || [])].map((item, index) => <li key={index}>{item}</li>)}</ul></div></div><RawJsonViewer data={analysis.queryShape} /></>}
      {validation && <div className="glass rounded-2xl p-5"><h3 className="mb-3 font-bold">Validation Result</h3><RawJsonViewer data={validation} /></div>}
    </div>
  );
}
