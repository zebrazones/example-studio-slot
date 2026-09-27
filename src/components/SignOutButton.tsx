"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={signOut} className="text-stone-500 hover:text-stone-900">
      Sign out
    </button>
  );
}
