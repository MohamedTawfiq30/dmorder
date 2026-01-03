"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideSidebar =
    pathname === "/" || pathname === "/login" || pathname?.startsWith("/o/");

  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100">
        {hideSidebar ? (
          children
        ) : (
          <div className="flex">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}
