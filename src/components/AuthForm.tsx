"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Field = { name: string; label: string; type: string; autoComplete?: string };

type Props = {
  endpoint: string;
  fields: Field[];
  submitLabel: string;
  redirectTo?: string;
  extra?: Record<string, string>;
  successMessage?: string;
};

export default function AuthForm({ endpoint, fields, submitLabel, redirectTo, extra, successMessage }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const data = { ...Object.fromEntries(new FormData(e.currentTarget)), ...extra };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    setPending(false);

    if (!res.ok) return setError(body.error ?? "Something went wrong.");
    if (successMessage) return setDone(body.message ?? successMessage);
    if (redirectTo) {
      router.push(redirectTo);
      router.refresh();
    }
  }

  if (done) return <p className="rounded-lg bg-white p-4 text-sm">{done}</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className="text-sm font-medium">{f.label}</span>
          <input
            name={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-brand focus:outline-none"
          />
        </label>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        disabled={pending}
        className="w-full rounded-full bg-brand py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "Please wait…" : submitLabel}
      </button>
    </form>
  );
}
