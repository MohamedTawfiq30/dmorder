"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Products", href: "/products" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <aside className="w-60 min-h-screen bg-zinc-950 border-r border-white/10 px-4 py-6">
      <h1 className="text-xl font-semibold mb-8">
        DM<span className="text-emerald-400">Order</span>
      </h1>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-lg text-sm transition
              ${
                pathname.startsWith(link.href)
                  ? "bg-white/10 text-emerald-400"
                  : "text-zinc-300 hover:bg-white/5"
              }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
