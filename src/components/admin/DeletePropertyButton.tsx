"use client";

import { useRouter } from "next/navigation";

export default function DeletePropertyButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-xs tracking-[0.12em] text-red-700 uppercase hover:underline"
      onClick={async () => {
        if (!confirm("Delete this shortlet and its bookings?")) return;
        const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
        if (res.ok) router.refresh();
      }}
    >
      Delete
    </button>
  );
}
