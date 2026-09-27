import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDay, formatTime } from "@/lib/format";
import NewClassForm from "@/components/NewClassForm";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (user.role !== "STAFF") redirect("/");

  const classes = await prisma.studioClass.findMany({
    where: { startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    take: 50,
    include: {
      bookings: {
        where: { status: "CONFIRMED" },
        select: { id: true, user: { select: { name: true } } },
      },
    },
  });

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Studio admin</h1>
        <p className="mt-2 text-stone-600">Add classes and see who is coming.</p>
      </section>

      <NewClassForm />

      <section>
        <h2 className="text-lg font-bold">Upcoming classes</h2>
        <ul className="mt-4 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {classes.map((c) => (
            <li key={c.id} className="px-5 py-4">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-semibold">
                  {c.title} <span className="font-normal text-stone-500">· {formatDay(c.startsAt)}, {formatTime(c.startsAt)}</span>
                </p>
                <span className="text-sm text-stone-500">{c.bookings.length}/{c.capacity}</span>
              </div>
              {c.bookings.length > 0 && (
                <p className="mt-1 text-sm text-stone-600">{c.bookings.map((b) => b.user.name).join(", ")}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
