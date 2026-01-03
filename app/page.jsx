"use client";

import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-zinc-100 overflow-hidden">

      {/* 🌈 CONTINUOUS ANIMATED BACKGROUND */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          background: [
            "linear-gradient(120deg, #020617, #022c22, #020617)",
            "linear-gradient(120deg, #020617, #064e3b, #020617)",
            "linear-gradient(120deg, #020617, #022c22, #020617)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* HEADER */}
      <header className="relative z-10 flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-semibold">
          DM<span className="text-emerald-400">Order</span>
        </h1>

        <div className="flex gap-3 text-sm">
          <a href="/login" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
            Login
          </a>
          <a href="/login" className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition">
            Get Started
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-36 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-4xl md:text-6xl font-semibold leading-tight"
        >
          Turn Instagram Comments <br />
          Into <span className="text-emerald-400">Instant Orders</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-zinc-400 max-w-2xl mx-auto"
        >
          DMOrder gives every product a Smart Order Link.
          Comment automation sends the link instantly.
          Customers pay, place order, and you track everything — automatically.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex justify-center gap-4"
        >
          <a
            href="https://wa.me/918072346135"
            className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition font-medium"
          >
            Contact for Demo
          </a>
          <a
            href="#how"
            className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition"
          >
            See How It Works
          </a>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <h3 className="text-3xl font-semibold text-center mb-14">
          How It Works
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
            >
              <p className="text-emerald-400 text-sm mb-2">Step {i + 1}</p>
              <h4 className="font-medium mb-2">{s.title}</h4>
              <p className="text-sm text-zinc-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <h3 className="text-3xl font-semibold text-center mb-14">
          Built for Social Commerce
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h4 className="font-medium mb-2">{f.title}</h4>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💎 PRICING / CONTACT */}
      <section className="relative z-10 px-6 pb-36 text-center">
        <h3 className="text-3xl font-semibold mb-4">
          Simple Founder-Led Pricing
        </h3>
        <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
          We onboard sellers personally to ensure automation works perfectly
          for your business.
        </p>

        <motion.div
          animate={{ boxShadow: ["0 0 0 rgba(16,185,129,0)", "0 0 40px rgba(16,185,129,0.5)", "0 0 0 rgba(16,185,129,0)"] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="max-w-md mx-auto bg-white/5 border border-emerald-400/40 rounded-3xl p-10 backdrop-blur-md"
        >
          <p className="text-emerald-400 text-sm mb-2">Limited Onboarding</p>
          <h4 className="text-3xl font-semibold mb-4">
            Custom Pricing
          </h4>
          <p className="text-zinc-400 text-sm mb-8">
            Based on your order volume & automation needs
          </p>

          <a
            href="https://wa.me/918072346135"
            className="inline-block w-full px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition font-medium"
          >
            Contact on WhatsApp
          </a>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <h3 className="text-3xl font-semibold text-center mb-14">
          FAQs
        </h3>

        <div className="space-y-6">
          <FAQ q="Do I need a website?" a="No. DMOrder replaces websites with Smart Order Links." />
          <FAQ q="Does this work with Instagram comments?" a="Yes. Comment → Auto DM → Smart Link → Order." />
          <FAQ q="Is payment automatic?" a="Customer pays via UPI and uploads proof." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        © 2026 DMOrder · Built by Mohamed Tawfiq J
      </footer>
    </div>
  );
}

/* DATA */

const steps = [
  { title: "Create Product", desc: "Add product once. Get a Smart Order Link." },
  { title: "Automate Comments", desc: "Instagram comment sends link instantly." },
  { title: "Customer Orders", desc: "Customer pays & places order." },
];

const features = [
  { title: "Smart Order Links", desc: "Each product has instant checkout." },
  { title: "Instagram Automation Ready", desc: "Works with comment → DM tools." },
  { title: "UPI Based Payments", desc: "No gateways. Simple & fast." },
];

function FAQ({ q, a }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <p className="font-medium mb-2">{q}</p>
      <p className="text-sm text-zinc-400">{a}</p>
    </div>
  );
}
