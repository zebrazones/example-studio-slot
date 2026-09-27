import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateToken, hashToken } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { sendPasswordResetEmail } from "@/lib/mail";
import { forgotPasswordSchema } from "@/lib/validators";

// Give members a full week, reset emails often sit unread for a few days
const RESET_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const { email } = forgotPasswordSchema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = generateToken();
      await prisma.passwordResetToken.create({
        data: {
          tokenHash: hashToken(token),
          userId: user.id,
          expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      });

      const appUrl = process.env.APP_URL ?? "http://localhost:3000";
      await sendPasswordResetEmail(user.email, `${appUrl}/reset-password?token=${token}`);
    }

    return NextResponse.json({ ok: true, message: "If that email has an account, a reset link is on its way." });
  } catch (err) {
    return handleApiError(err);
  }
}
