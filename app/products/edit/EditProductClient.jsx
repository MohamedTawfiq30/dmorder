"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "../../../lib/useAuth";
import { getProductById, updateProduct } from "../../../lib/products";

export default function EditProductClient() {
  const loading = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productDocId = searchParams.get("id");

  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([{ label: "", stock: "" }]);
  const [colors, setColors] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!productDocId) return;

    getProductById(productDocId).then((product) => {
      if (!product) return;

      setProductId(product.productId);
      setName(product.name);
      setPrice(product.price);
      setColors(product.colors?.join(", ") || "");

      const sizeArray = Object.entries(product.sizes || {}).map(
        ([label, stock]) => ({ label, stock })
      );

      setSizes(sizeArray.length ? sizeArray : [{ label: "", stock: "" }]);
    });
  }, [productDocId]);

  if (loading) return null;

  function updateSize(index, field, value) {
    const updated = [...sizes];
    updated[index][field] = value;
    setSizes(updated);
  }

  function addSizeRow() {
    setSizes([...sizes, { label: "", stock: "" }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const sizeObject = {};
    sizes.forEach((s) => {
      if (s.label && s.stock !== "") {
        sizeObject[s.label] = Number(s.stock);
      }
    });

    await updateProduct(productDocId, {
      productId,
      name,
      price: Number(price),
      sizes: sizeObject,
      colors: colors.split(",").map((c) => c.trim()),
    });

    router.push("/products");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6"
      >
        <h1 className="text-2xl font-semibold">Edit Product</h1>

        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="input"
          placeholder="Product ID"
        />

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Product Name"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          className="input"
          placeholder="Price"
        />

        <div>
          <p className="text-sm text-zinc-400 mb-2">Sizes & Stock</p>
          {sizes.map((s, i) => (
            <div key={i} className="flex gap-3 mb-2">
              <input
                value={s.label}
                onChange={(e) => updateSize(i, "label", e.target.value)}
                className="flex-1 input"
                placeholder="Size"
              />
              <input
                value={s.stock}
                onChange={(e) => updateSize(i, "stock", e.target.value)}
                type="number"
                className="w-28 input"
                placeholder="Stock"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addSizeRow}
            className="text-emerald-400 text-sm"
          >
            + Add size
          </button>
        </div>

        <input
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          className="input"
          placeholder="Colors (Black, Blue)"
        />

        <button
          disabled={saving}
          className="bg-emerald-500 px-6 py-2 rounded-lg text-sm"
        >
          {saving ? "Saving..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
