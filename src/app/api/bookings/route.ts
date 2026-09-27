import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { createBookingSchema } from "@/lib/validators";

export async function GET() {
  try {
    const user = await requireUser();
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id, status: "CONFIRMED", class: { startsAt: { gte: new Date() } } },
      orderBy: { class: { startsAt: "asc" } },
      include: { class: true },
    });
    return NextResponse.json(bookings);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const { classIds } = createBookingSchema.parse(await req.json());

    const booked: string[] = [];
    const skipped: { classId: string; reason: string }[] = [];

    for (const classId of classIds) {
      const result = await prisma.$transaction(
        async (tx) => {
          const studioClass = await tx.studioClass.findUniqueOrThrow({ where: { id: classId } });
          if (studioClass.startsAt < new Date()) return "This class has already started.";

          const taken = await tx.booking.count({ where: { classId, status: "CONFIRMED" } });
          if (taken >= studioClass.capacity) return "This class is full.";

          await tx.booking.upsert({
            where: { userId_classId: { userId: user.id, classId } },
            update: { status: "CONFIRMED" },
            create: { userId: user.id, classId },
          });
          return null;
        },
        { isolationLevel: "Serializable" },
      );

      if (result) skipped.push({ classId, reason: result });
      else booked.push(classId);
    }

    if (booked.length === 0) {
      return NextResponse.json({ error: skipped[0]?.reason ?? "Booking failed.", skipped }, { status: 409 });
    }
    return NextResponse.json({ booked, skipped }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
