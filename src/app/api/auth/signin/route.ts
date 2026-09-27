import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { signInSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const limited = rateLimit(`signin:${clientIp(req)}`, 10, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    const { email, password } = signInSchema.parse(await req.json());

    const perAccount = rateLimit(`signin:${email}`, 5, 15 * 60 * 1000);
    if (perAccount) return perAccount;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "No account found with that email." }, { status: 404 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password. Try again or reset it." }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
