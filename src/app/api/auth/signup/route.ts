import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { signUpSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const { name, email, password } = signUpSchema.parse(await req.json());

    const user = await prisma.user.create({
      data: { name, email, passwordHash: await hashPassword(password) },
    });

    await createSession(user.id);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
