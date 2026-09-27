import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDay } from "@/lib/format";
import ClassRow from "@/components/ClassRow";
import CancelButton from "@/components/CancelButton";

export default async function BookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id, status: "CONFIRMED", class: { startsAt: { gte: new Date() } } },
    orderBy: { class: { startsAt: "asc" } },
    include: { class: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Hi {user.name.split(" ")[0]}, your upcoming classes</h1>
      {bookings.length === 0 ? (
        <p className="mt-6 text-stone-600">
          Nothing booked yet. <Link href="/" className="underline">Browse the schedule.</Link>
        </p>
      ) : (
        <div className="mt-8 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white px-5">
          {bookings.map((b) => (
            <div key={b.id}>
              <p className="pt-4 text-xs font-bold uppercase tracking-wider text-stone-500">{formatDay(b.class.startsAt)}</p>
              <ul>
                <ClassRow {...b.class} spotsLeft={0} action={<CancelButton bookingId={b.id} />} />
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
