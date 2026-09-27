"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { classIds: string[]; label: string; variant?: "primary" | "secondary"; disabled?: boolean };

export default function BookButton({ classIds, label, variant = "primary", disabled }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function book() {
    setPending(true);
    setError(null);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classIds }),
    });
    setPending(false);

    if (res.status === 401) return router.push("/signin");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return setError(body.error ?? "Booking failed.");
    }
    router.push("/bookings");
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={book}
        disabled={disabled || pending}
        className={variant === "primary" ? "rounded-full bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-40" : "rounded-full border border-brand px-6 py-2.5 font-semibold text-brand hover:bg-brand/5 disabled:opacity-40"}
      >
        {pending ? "Booking…" : label}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
