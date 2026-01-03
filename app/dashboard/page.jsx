"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../lib/useAuth";
import { logoutUser } from "../../lib/auth";
import { markOrderCompleted } from "../../lib/orders";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardPage() {
  const loading = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const unsubscribeOrdersRef = useRef(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeOrdersRef.current) {
        unsubscribeOrdersRef.current();
      }

      if (!user) {
        setOrders([]);
        return;
      }

      const q = query(
        collection(db, "orders"),
        where("ownerId", "==", user.uid)
      );

      unsubscribeOrdersRef.current = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        data.sort((a, b) => {
          const at = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const bt = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return bt - at;
        });

        setOrders(data);
      });
    });

    return () => {
      unsubAuth();
      if (unsubscribeOrdersRef.current) unsubscribeOrdersRef.current();
    };
  }, []);

  if (loading) return null;

  /* ---------- TIME ---------- */
  const now = new Date();
  const todayStr = now.toDateString();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  /* ---------- STATS ---------- */
  const todayOrders = orders.filter(
    (o) =>
      o.createdAt &&
      o.createdAt.toDate().toDateString() === todayStr
  );

  const pending24h = orders.filter(
    (o) =>
      o.status === "pending" &&
      o.createdAt &&
      o.createdAt.toDate() >= last24h
  );

  const completed24h = orders.filter(
    (o) =>
      o.status === "completed" &&
      o.createdAt &&
      o.createdAt.toDate() >= last24h
  );

  /* ---------- RECENT (ONLY PENDING) ---------- */
  const recentOrders = orders
    .filter((o) => o.status === "pending")
    .slice(0, 10);

  /* ---------- TODAY COMPLETED ---------- */
  const todayCompleted = orders.filter(
    (o) =>
      o.status === "completed" &&
      o.createdAt &&
      o.createdAt.toDate().toDateString() === todayStr
  );

  /* ---------- PREVIOUS COMPLETED (DATE GROUPED) ---------- */
  const previousCompletedByDate = {};
  orders.forEach((o) => {
    if (o.status !== "completed" || !o.createdAt) return;

    const d = o.createdAt.toDate();
    if (d.toDateString() === todayStr) return;

    const key = d.toDateString();
    if (!previousCompletedByDate[key]) {
      previousCompletedByDate[key] = [];
    }
    previousCompletedByDate[key].push(o);
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-8 py-8">

      {/* TOP BAR */}
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-semibold">
          DM<span className="text-emerald-400">Order</span> Dashboard
        </h1>
        <button
          onClick={async () => {
            await logoutUser();
            router.push("/login");
          }}
          className="border border-white/10 px-4 py-2 rounded-lg  hover:bg-emerald-600 transition"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard title="Today Orders" value={todayOrders.length} highlight />
        <StatCard title="Pending (24h)" value={pending24h.length} />
        <StatCard title="Completed (24h)" value={completed24h.length} />
      </div>

      {/* RECENT */}
      <Section title="Recent Orders (Pending)">
        {recentOrders.length === 0 && (
          <p className="text-zinc-400 text-sm">No pending orders</p>
        )}
        {recentOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </Section>

      {/* TODAY COMPLETED */}
      <Section title="Today – Completed Orders">
        {todayCompleted.length === 0 && (
          <p className="text-zinc-400 text-sm">No completed orders today</p>
        )}
        {todayCompleted.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </Section>

      {/* PREVIOUS */}
      <Section title="Previous Completed Orders">
        {Object.keys(previousCompletedByDate).length === 0 && (
          <p className="text-zinc-400 text-sm">No previous completed orders</p>
        )}

        {Object.entries(previousCompletedByDate).map(([date, list]) => (
          <div key={date} className="mb-6">
            <h3 className="text-sm text-zinc-400 mb-2">{date}</h3>
            {list.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ))}
      </Section>

    </div>
  );
}

/* ---------- UI ---------- */

function StatCard({ title, value, highlight }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <p className="text-zinc-400 text-sm">{title}</p>
      <h2
        className={`text-4xl font-semibold mt-2 ${
          highlight ? "text-emerald-400" : ""
        }`}
      >
        {value}
      </h2>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col lg:flex-row lg:justify-between gap-4">
      <div>
        <p className="font-medium">{order.productName}</p>
        <p className="text-xs text-zinc-500">
          {order.productId} · {order.size} · {order.color}
        </p>

        <p className="text-sm mt-2">Customer: {order.customerName}</p>
        <p className="text-sm">Mobile: {order.phone}</p>
        <p className="text-sm text-zinc-400">Address: {order.address}</p>

        {order.paymentScreenshotUrl && (
          <a
            href={order.paymentScreenshotUrl}
            target="_blank"
            className="inline-block mt-2 text-emerald-400 text-sm underline"
          >
            View Payment Screenshot
          </a>
        )}
      </div>

      {order.status === "pending" ? (
        <button
          onClick={() => markOrderCompleted(order.id)}
          className="px-4 py-2 border border-white/10 rounded-lg"
        >
          Mark Completed
        </button>
      ) : (
        <span className="text-emerald-400 self-start">Completed</span>
      )}
    </div>
  );
}
