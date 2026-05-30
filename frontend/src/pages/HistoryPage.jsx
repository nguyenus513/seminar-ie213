import { useEffect, useState } from "react";
import BenchmarkTable from "../components/tables/BenchmarkTable";
import { benchmarkApi } from "../api/benchmarkApi";

export default function HistoryPage() {
  const [rows, setRows] = useState([]); useEffect(() => { benchmarkApi.history().then(setRows); }, []);
  return <div className="space-y-6"><div className="flex justify-between gap-4"><div><h2 className="text-3xl font-black">History</h2><p className="text-slate-400">Các lần benchmark đã lưu trong MongoDB.</p></div><a className="btn-muted" href="http://localhost:5000/api/benchmark/export/csv">Export CSV</a></div><BenchmarkTable rows={rows} /></div>;
}
