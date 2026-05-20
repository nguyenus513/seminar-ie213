import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { shopApi } from "../api/shopApi";

export default function ProductDetailPage() {
  const { id } = useParams(); const [product, setProduct] = useState(null);
  useEffect(() => { shopApi.product(id).then(setProduct); }, [id]);
  if (!product) return <div className="text-slate-400">Loading product...</div>;
  return <div className="grid gap-6 lg:grid-cols-2"><img src={product.imageUrl} className="w-full rounded-3xl border border-line object-cover" /><div className="glass rounded-3xl p-6"><div className="text-accent">{product.brand} · {product.category}</div><h2 className="mt-2 text-4xl font-black">{product.name}</h2><div className="mt-4 text-3xl font-black">{product.price.toLocaleString("vi-VN")}đ</div><p className="mt-5 text-slate-300">{product.description}</p><div className="mt-5 text-sm text-slate-400">Rating {product.rating} · Reviews {product.reviewCount} · Sold {product.sold}</div></div></div>;
}
