import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDay, formatTime } from "@/lib/format";
import BookButton from "@/components/BookButton";

export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [studioClass, user] = await Promise.all([
    prisma.studioClass.findUnique({
      where: { id },
      include: { _count: { select: { bookings: { where: { status: "CONFIRMED" } } } } },
    }),
    getCurrentUser(),
  ]);
  if (!studioClass) notFound();

  const spotsLeft = Math.max(studioClass.capacity - studioClass._count.bookings, 0);
  const alreadyBooked = user
    ? (await prisma.booking.count({ where: { userId: user.id, classId: id, status: "CONFIRMED" } })) > 0
    : false;

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-8">
      <p className="text-sm font-semibold text-brand">
        {formatDay(studioClass.startsAt)} · {formatTime(studioClass.startsAt)}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{studioClass.title}</h1>
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div><dt className="text-stone-500">Instructor</dt><dd className="font-medium">{studioClass.instructor}</dd></div>
        <div><dt className="text-stone-500">Room</dt><dd className="font-medium">{studioClass.room}</dd></div>
        <div><dt className="text-stone-500">Length</dt><dd className="font-medium">{studioClass.durationMin} min</dd></div>
        <div><dt className="text-stone-500">Spots left</dt><dd className="font-medium">{spotsLeft} of {studioClass.capacity}</dd></div>
      </dl>
      <div className="mt-8">
        {alreadyBooked ? (
          <p className="font-medium text-brand">You're booked for this class.</p>
        ) : (
          <BookButton classId={studioClass.id} disabled={spotsLeft === 0} />
        )}
      </div>
    </article>
  );
}
