"use client";

import { useRouter } from "next/navigation";

export default function CancelButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();

  async function cancel() {
    if (!confirm("Cancel this booking?")) return;
    await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={cancel} className="text-sm font-medium text-stone-500 hover:text-red-600">
      Cancel
    </button>
  );
}
