import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <img src={product.imageUrl} alt={product.name} className="h-44 w-full object-cover" />
      <div className="p-4">
        <div className="text-xs uppercase tracking-widest text-accent">{product.brand} · {product.category}</div>
        <h3 className="mt-2 line-clamp-2 min-h-12 font-bold">{product.name}</h3>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-lg font-black text-white">{product.price?.toLocaleString("vi-VN")}đ</div>
            <div className="text-xs text-slate-400">⭐ {product.rating} · Đã bán {product.sold}</div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link to={`/shop/product/${product._id}`} className="btn-muted flex-1 text-center">Detail</Link>
          <button onClick={() => onAdd(product)} className="btn flex-1">Add</button>
        </div>
      </div>
    </div>
  );
}
