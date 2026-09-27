import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-brand">
          StudioSlots
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href="/">Schedule</Link>
          {user ? (
            <>
              <Link href="/bookings">My bookings</Link>
              {user.role === "STAFF" && <Link href="/admin">Admin</Link>}
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/signin">Sign in</Link>
              <Link href="/signup" className="rounded-full bg-brand px-4 py-2 text-white hover:bg-brand-dark">
                Join
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
