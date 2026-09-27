"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const input = "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none";

export default function NewClassForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, startsAt: new Date(String(data.startsAt)).toISOString() }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return setError(body.error ?? "Could not create class.");
    }
    setError(null);
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-stone-200 bg-white p-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Title<input name="title" required className={input} /></label>
      <label className="text-sm font-medium">Instructor<input name="instructor" required className={input} /></label>
      <label className="text-sm font-medium">Room<input name="room" required className={input} /></label>
      <label className="text-sm font-medium">Starts at<input name="startsAt" type="datetime-local" required className={input} /></label>
      <label className="text-sm font-medium">Duration (min)<input name="durationMin" type="number" defaultValue={60} min={15} max={240} className={input} /></label>
      <label className="text-sm font-medium">Capacity<input name="capacity" type="number" defaultValue={16} min={1} max={100} className={input} /></label>
      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      <button className="rounded-full bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark sm:col-span-2">
        Add class
      </button>
    </form>
  );
}
