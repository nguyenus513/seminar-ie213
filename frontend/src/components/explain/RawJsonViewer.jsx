export default function RawJsonViewer({ data }) {
  return <pre className="max-h-[560px] overflow-auto rounded-2xl border border-line bg-black/40 p-4 text-xs leading-relaxed text-slate-200">{JSON.stringify(data, null, 2)}</pre>;
}
