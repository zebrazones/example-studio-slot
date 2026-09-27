import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { createClassSchema } from "@/lib/validators";

export async function GET() {
  try {
    const classes = await prisma.studioClass.findMany({
      where: { startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 100,
      include: { _count: { select: { bookings: { where: { status: "CONFIRMED" } } } } },
    });

    return NextResponse.json(
      classes.map(({ _count, ...c }) => ({ ...c, spotsLeft: Math.max(c.capacity - _count.bookings, 0) })),
    );
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    await requireStaff();
    const data = createClassSchema.parse(await req.json());
    const created = await prisma.studioClass.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
