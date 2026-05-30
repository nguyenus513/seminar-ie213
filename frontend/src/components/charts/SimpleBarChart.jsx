import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function SimpleBarChart({ data = [], dataKey, name, color = "#18E6A7" }) {
  return (
    <div className="glass h-72 rounded-2xl p-4">
      <h3 className="mb-3 font-bold">{name}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,.08)" />
          <XAxis dataKey="queryKey" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#101522", border: "1px solid rgba(255,255,255,.1)", color: "white" }} />
          <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
