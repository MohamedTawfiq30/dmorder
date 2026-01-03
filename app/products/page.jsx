"use client";

import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../lib/products";
import useAuth from "../../lib/useAuth";

export default function ProductsPage() {
  const loading = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  if (loading) return null;

  const getSmartLink = (productId) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/o/${productId}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-zinc-400 text-sm">
            Manage your clothing products and stock
          </p>
        </div>

        <a
          href="/products/new"
          className="bg-emerald-500 hover:bg-emerald-600 transition px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Product
        </a>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {products.length === 0 && (
          <p className="text-zinc-400 text-sm">No products added yet.</p>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            {/* Product Info */}
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-xs text-zinc-500">
                ID: {product.productId || product.id}
              </p>
              <p className="text-zinc-400 text-sm mt-1">
                ₹{product.price}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              {/* Copy Smart Link */}
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    getSmartLink(product.productId || product.id)
                  )
                }
                title="Copy Smart Order Link"
                className="text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition"
              >
                🔗
              </button>

              {/* Edit */}
              <a
                href={`/products/edit?id=${product.id}`}
                className="text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition"
              >
                Edit
              </a>

              {/* Delete */}
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("Delete this product?")) return;
                  await deleteProduct(product.id);
                  setProducts(products.filter((p) => p.id !== product.id));
                }}
                className="text-sm px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
