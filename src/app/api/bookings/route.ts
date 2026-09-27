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
    const { classId } = createBookingSchema.parse(await req.json());

    const booking = await prisma.$transaction(
      async (tx) => {
        const studioClass = await tx.studioClass.findUniqueOrThrow({ where: { id: classId } });
        if (studioClass.startsAt < new Date()) {
          return { error: "This class has already started." } as const;
        }

        const taken = await tx.booking.count({ where: { classId, status: "CONFIRMED" } });
        if (taken >= studioClass.capacity) {
          return { error: "This class is full." } as const;
        }

        return tx.booking.upsert({
          where: { userId_classId: { userId: user.id, classId } },
          update: { status: "CONFIRMED" },
          create: { userId: user.id, classId },
        });
      },
      { isolationLevel: "Serializable" },
    );

    if ("error" in booking) {
      return NextResponse.json({ error: booking.error }, { status: 409 });
    }
    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
