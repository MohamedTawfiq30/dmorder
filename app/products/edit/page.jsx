import { Suspense } from "react";
import EditProductClient from "./EditProductClient";

export default function EditProductPage() {
  return (
    <Suspense fallback={<p className="text-zinc-400 p-6">Loading...</p>}>
      <EditProductClient />
    </Suspense>
  );
}
