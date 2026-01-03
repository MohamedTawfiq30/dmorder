"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../../lib/useAuth";
import { addProduct } from "../../../lib/products";
import { auth } from "../../../lib/firebase";

export default function AddProductPage() {
  const loading = useAuth();
  const router = useRouter();

  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([{ label: "", stock: "" }]);
  const [colors, setColors] = useState("");

  if (loading) return null;

  function updateSize(index, field, value) {
    const updated = [...sizes];
    updated[index][field] = value;
    setSizes(updated);
  }

  function addSizeRow() {
    setSizes([...sizes, { label: "", stock: "" }]);
  }

  function removeSizeRow(index) {
    setSizes(sizes.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("You must be logged in");
      return;
    }

    const sizeObject = {};
    sizes.forEach((s) => {
      if (s.label && s.stock !== "") {
        sizeObject[s.label] = Number(s.stock);
      }
    });

    await addProduct({
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
        <h1 className="text-2xl font-semibold">Add Product</h1>

        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Product ID (SHIRT001)"
          required
          className="input"
        />

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          required
          className="input"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          placeholder="Price ₹"
          required
          className="input"
        />

        {/* Sizes */}
        <div>
          <p className="text-sm text-zinc-400 mb-2">Sizes & Stock</p>
          {sizes.map((s, i) => (
            <div key={i} className="flex gap-3 mb-2">
              <input
                value={s.label}
                onChange={(e) => updateSize(i, "label", e.target.value)}
                placeholder="Size (S / 32 / Free)"
                className="flex-1 input"
              />
              <input
                value={s.stock}
                onChange={(e) => updateSize(i, "stock", e.target.value)}
                type="number"
                placeholder="Stock"
                className="w-28 input"
              />
              {sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSizeRow(i)}
                  className="text-red-400"
                >
                  ✕
                </button>
              )}
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
          placeholder="Colors (Black, Blue)"
          className="input"
        />

        <button className="bg-emerald-500 px-6 py-2 rounded-lg text-sm">
          Save Product
        </button>
      </form>
    </div>
  );
}
