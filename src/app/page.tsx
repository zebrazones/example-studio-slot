import { prisma } from "@/lib/db";
import { formatDay, groupByDay } from "@/lib/format";
import ClassRow from "@/components/ClassRow";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const classes = await prisma.studioClass.findMany({
    where: { startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    take: 100,
    include: { _count: { select: { bookings: { where: { status: "CONFIRMED" } } } } },
  });

  const days = groupByDay(classes);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">This week at the studio</h1>
      <p className="mt-2 text-stone-600">Pick a class and save your spot. Cancel anytime before it starts.</p>

      {days.length === 0 && <p className="mt-10 text-stone-500">No upcoming classes yet.</p>}

      <div className="mt-8 space-y-8">
        {days.map((day) => (
          <section key={day[0].startsAt.toDateString()}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">{formatDay(day[0].startsAt)}</h2>
            <ul className="mt-2 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white px-5">
              {day.map((c) => (
                <ClassRow key={c.id} {...c} spotsLeft={Math.max(c.capacity - c._count.bookings, 0)} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
