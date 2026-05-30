import { useMemo } from "react";
import { getProductImageUrl, useProductImageFallback } from "../utils/productImages";

export default function CartPage() {
  const items = useMemo(() => JSON.parse(localStorage.getItem("cart") || "[]"), []);
  return <div className="space-y-6"><h2 className="text-3xl font-black">Cart Demo</h2><div className="space-y-3">{items.map((item, index) => <div key={`${item._id}-${index}`} className="glass flex items-center gap-4 rounded-2xl p-4"><img src={getProductImageUrl(item)} data-fallback-src={item.imageUrl} onError={useProductImageFallback} alt={item.name} className="h-16 w-16 rounded-xl bg-slate-950 object-contain p-1" /><div><div className="font-bold">{item.name}</div><div className="text-sm text-slate-400">{item.price?.toLocaleString("vi-VN")}đ</div></div></div>)}{!items.length && <div className="text-slate-400">Cart đang trống.</div>}</div></div>;
}
