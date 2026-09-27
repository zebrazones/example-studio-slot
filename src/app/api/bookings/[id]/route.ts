import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const { count } = await prisma.booking.updateMany({
      where: { id, userId: user.id, status: "CONFIRMED" },
      data: { status: "CANCELLED" },
    });
    if (count === 0) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
