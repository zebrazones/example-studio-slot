import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { handleApiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireStaff();
    const { id } = await params;

    const bookings = await prisma.booking.findMany({
      where: { classId: id, status: "CONFIRMED" },
      orderBy: { createdAt: "asc" },
      select: { id: true, createdAt: true, user: { select: { name: true, email: true } } },
    });
    return NextResponse.json(bookings);
  } catch (err) {
    return handleApiError(err);
  }
}
