import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AuthError } from "./auth";

export function handleApiError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  if (err instanceof ZodError) {
    return NextResponse.json({ error: "Invalid input", issues: err.flatten().fieldErrors }, { status: 400 });
  }

  // Return the full Prisma error so failed queries are easy to debug from the client
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(
      { error: err.message, code: err.code, meta: err.meta, stack: err.stack },
      { status: err.code === "P2002" ? 409 : 400 },
    );
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 400 });
  }

  console.error(err);
  const message = err instanceof Error ? err.message : "Something went wrong";
  const stack = err instanceof Error ? err.stack : undefined;
  return NextResponse.json({ error: message, stack }, { status: 500 });
}
