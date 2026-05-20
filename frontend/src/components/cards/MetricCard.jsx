export default function MetricCard({ label, value, hint }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-black text-white">{value ?? "-"}</div>
      {hint && <div className="mt-2 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
