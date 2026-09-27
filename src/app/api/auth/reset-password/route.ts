import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, hashPassword, hashToken } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { resetPasswordSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const limited = rateLimit(`reset-password:${clientIp(req)}`, 10, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    const { token, password } = resetPasswordSchema.parse(await req.json());

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash: await hashPassword(password) },
      }),
      // Sign out everywhere else after a password change
      prisma.session.deleteMany({ where: { userId: resetToken.userId } }),
    ]);

    await createSession(resetToken.userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
