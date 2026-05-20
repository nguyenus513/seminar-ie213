import { NavLink } from "react-router-dom";

const links = [
  ["/shop", "Shop"],
  ["/overview", "Overview"],
  ["/dataset", "Dataset"],
  ["/indexes", "Indexes"],
  ["/benchmark", "Benchmark"],
  ["/strategy-comparison", "Strategy Compare"],
  ["/compare", "Compare"],
  ["/ai-index-advisor", "AI Advisor"],
  ["/explain/PRODUCTS_BY_CATEGORY", "Explain"],
  ["/history", "History"]
];

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(24,230,167,.14),transparent_34%),#070A12]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-black/30 p-5 backdrop-blur lg:block">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.35em] text-accent">Strict MERN</div>
          <h1 className="mt-2 text-xl font-black leading-tight">MongoDB Indexing Benchmark</h1>
        </div>
        <nav className="space-y-2">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-accent text-ink" : "text-slate-300 hover:bg-white/10"}`}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-line bg-ink/80 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-400">MongoDB + Express + React + Node.js</div>
              <div className="font-bold">E-commerce Search Performance Lab</div>
            </div>
            <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">MongoDB Local</div>
          </div>
        </header>
        <div className="p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
