"use client";

import { useEffect, useState } from "react";
import useAuth from "../../lib/useAuth";
import { auth, db, storage } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

export default function SettingsPage() {
  const loading = useAuth();

  const [user, setUser] = useState(null);

  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [upiId, setUpiId] = useState("");
  const [qrFile, setQrFile] = useState(null);
  const [qrUrl, setQrUrl] = useState("");

  const [saving, setSaving] = useState(false);

  // 🔐 Wait for Firebase auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsub();
  }, []);

  // 📥 Load existing settings
  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      const snap = await getDoc(doc(db, "settings", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setBusinessName(data.businessName || "");
        setWhatsapp(data.whatsapp || "");
        setAddress(data.address || "");
        setUpiId(data.upiId || "");
        setQrUrl(data.qrUrl || "");
      }
    };

    loadSettings();
  }, [user]);

  if (loading || !user) return null;

  // 💾 Save settings safely
  async function handleSave() {
    setSaving(true);

    try {
      let finalQrUrl = qrUrl;

      // Upload QR only if selected
      if (qrFile) {
        try {
          const qrRef = ref(storage, `upi_qr/${user.uid}.png`);
          await uploadBytes(qrRef, qrFile);
          finalQrUrl = await getDownloadURL(qrRef);
        } catch (err) {
          console.error("QR upload failed:", err);
          alert("QR upload failed, saving other details");
        }
      }

      await setDoc(
        doc(db, "settings", user.uid),
        {
          businessName,
          whatsapp,
          address,
          upiId,
          qrUrl: finalQrUrl,
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      alert("Settings saved successfully ✅");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10 flex justify-center">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">

        <h1 className="text-2xl font-semibold">Business Settings</h1>

        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Business Name"
          className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2 text-sm"
        />

        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="WhatsApp Number"
          className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2 text-sm"
        />

        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Business Address"
          rows={3}
          className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2 text-sm"
        />

        <input
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="UPI ID (example@upi)"
          className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2 text-sm"
        />

        <div>
          <p className="text-sm text-zinc-400 mb-1">UPI QR Code</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setQrFile(e.target.files[0])}
          />

          {qrUrl && (
            <img
              src={qrUrl}
              alt="UPI QR"
              className="mt-3 w-32 rounded-lg border border-white/10"
            />
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-500 hover:bg-emerald-600 transition px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

      </div>
    </div>
  );
}
