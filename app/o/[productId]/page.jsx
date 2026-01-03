"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../lib/firebase";
import {
  doc,
  runTransaction,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";

export default function OrderPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 🔥 NEW
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [success, setSuccess] = useState(false);

  // 🔹 Load product + owner settings
  useEffect(() => {
    async function fetchData() {
      const q = query(
        collection(db, "products"),
        where("productId", "==", productId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setLoading(false);
        return;
      }

      const productDoc = snapshot.docs[0];
      const productData = { id: productDoc.id, ...productDoc.data() };
      setProduct(productData);

      if (productData.ownerId) {
        const settingsSnap = await getDoc(
          doc(db, "settings", productData.ownerId)
        );
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data());
        }
      }

      setLoading(false);
    }

    fetchData();
  }, [productId]);

  // 🔥 Upload screenshot to Cloudinary
  async function uploadScreenshot() {
    if (!screenshotFile) return "";

    const formData = new FormData();
    formData.append("file", screenshotFile);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  }

  async function placeOrder() {
    if (!size || !color || !name || !phone || !address || !screenshotFile) {
      alert("Please fill all details and upload payment screenshot");
      return;
    }

    setUploading(true);

    try {
      const screenshotUrl = await uploadScreenshot();
      const productRef = doc(db, "products", product.id);

      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(productRef);
        if (!snap.exists()) throw new Error("Product not found");

        const data = snap.data();
        const stock = data.sizes[size];

        if (!stock || stock <= 0) {
          throw new Error("Selected size out of stock");
        }

        transaction.update(productRef, {
          [`sizes.${size}`]: stock - 1,
        });

        const orderRef = doc(collection(db, "orders"));
        transaction.set(orderRef, {
          ownerId: data.ownerId,
          productId: data.productId,
          productName: data.name,
          size,
          color,
          quantity: 1,
          price: data.price,

          customerName: name,
          phone,
          address,

          paymentScreenshotUrl: screenshotUrl,
          status: "pending",
          createdAt: serverTimestamp(),
        });
      });

      setSuccess(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        Product not found
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Order Placed ✅</h2>
          <p className="text-zinc-400 text-sm">
            Payment received. Seller will verify and contact you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10 flex justify-center">
      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">

        {/* Product */}
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-zinc-400">₹{product.price}</p>
        </div>

        {/* Sizes */}
        <div>
          <p className="text-sm text-zinc-400 mb-2">Select Size</p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(product.sizes).map(
              ([k, v]) =>
                v > 0 && (
                  <button
                    key={k}
                    onClick={() => setSize(k)}
                    className={`px-4 py-2 rounded-lg border ${
                      size === k
                        ? "border-emerald-500 bg-emerald-500/20"
                        : "border-white/10"
                    }`}
                  >
                    {k}
                  </button>
                )
            )}
          </div>
        </div>

        {/* Colors */}
        <div>
          <p className="text-sm text-zinc-400 mb-2">Select Color</p>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 rounded-lg border ${
                  color === c
                    ? "border-emerald-500 bg-emerald-500/20"
                    : "border-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 🔥 PAYMENT INFO (FROM SETTINGS) */}
        {settings && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="text-sm text-zinc-400">Pay via UPI</p>
            <p className="text-lg font-medium">{settings.upiId}</p>

            {settings.qrUrl && (
              <img
                src={settings.qrUrl}
                alt="UPI QR"
                className="w-40 rounded-xl border border-white/10"
              />
            )}
          </div>
        )}

        {/* 🔥 Screenshot Upload */}
        <div>
          <p className="text-sm text-zinc-400 mb-1">
            Upload Payment Screenshot
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshotFile(e.target.files[0])}
          />
        </div>

        {/* Customer Details */}
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input"
        />

        <button
          onClick={placeOrder}
          disabled={uploading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 transition py-3 rounded-lg font-medium disabled:opacity-60"
        >
          {uploading ? "Placing Order..." : "I’ve Paid – Place Order"}
        </button>
      </div>
    </div>
  );
}
