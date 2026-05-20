import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/shop/ProductCard";
import PerformancePanel from "../components/shop/PerformancePanel";
import SearchStatsBar from "../components/shop/SearchStatsBar";
import RawJsonViewer from "../components/explain/RawJsonViewer";
import { shopApi } from "../api/shopApi";

const initialParams = { q: "iphone", category: "all", brand: "all", minPrice: "", maxPrice: "", sort: "relevance", searchMode: "regex", page: 1, limit: 20 };
const categories = ["all", "phone", "laptop", "tablet", "watch", "accessory", "audio", "camera", "gaming"];
const brands = ["all", "Apple", "Samsung", "Xiaomi", "Oppo", "Dell", "Asus", "Lenovo", "Sony", "Logitech"];

export default function ShopPage() {
  const [params, setParams] = useState(initialParams);
  const [result, setResult] = useState(null);
  const [compare, setCompare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cart = useMemo(() => JSON.parse(localStorage.getItem("cart") || "[]"), []);

  async function load(nextParams = params) {
    setLoading(true); setError("");
    try { setResult(await shopApi.products(nextParams)); }
    catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(initialParams); }, []);

  function update(key, value) { setParams((current) => ({ ...current, [key]: value, page: 1 })); }
  function addToCart(product) { localStorage.setItem("cart", JSON.stringify([...cart, product])); alert("Đã thêm vào cart demo"); }
  async function compareSearch() { setCompare(await shopApi.compare(params)); }

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div><div className="text-sm uppercase tracking-[0.3em] text-accent">MERN E-commerce</div><h2 className="mt-2 text-3xl font-black">Search Product Benchmark</h2></div>
          <button onClick={compareSearch} className="btn-muted">Compare This Search</button>
        </div>
        <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-8">
          <input className="input md:col-span-2" value={params.q} onChange={(e) => update("q", e.target.value)} placeholder="Search iphone, laptop..." />
          <select className="input" value={params.category} onChange={(e) => update("category", e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
          <select className="input" value={params.brand} onChange={(e) => update("brand", e.target.value)}>{brands.map((item) => <option key={item}>{item}</option>)}</select>
          <input className="input" value={params.minPrice} onChange={(e) => update("minPrice", e.target.value)} placeholder="Min price" />
          <input className="input" value={params.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} placeholder="Max price" />
          <select className="input" value={params.sort} onChange={(e) => update("sort", e.target.value)}>
            {["relevance", "price_asc", "price_desc", "rating_desc", "sold_desc", "newest"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="input" value={params.searchMode} onChange={(e) => update("searchMode", e.target.value)}><option value="regex">regex</option><option value="text">text</option></select>
        </div>
        <div className="mt-4 flex items-center gap-3"><button onClick={() => load(params)} disabled={loading} className="btn">{loading ? "Searching..." : "Search"}</button><SearchStatsBar pagination={result?.pagination} performance={result?.performance} /></div>
        {error && <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
      </section>
      <PerformancePanel performance={result?.performance} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {result?.data?.map((product) => <ProductCard key={product._id} product={product} onAdd={addToCart} />)}
      </section>
      {compare && <div className="glass rounded-2xl p-5"><div className="mb-3 flex justify-between"><h3 className="font-bold">Search Comparison</h3><button onClick={() => setCompare(null)} className="text-slate-400">Close</button></div><RawJsonViewer data={compare} /></div>}
    </div>
  );
}
