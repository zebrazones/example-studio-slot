import { NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

/**
 * Client IP as seen by our reverse proxy. Only trusted when TRUST_PROXY=1, i.e. the
 * app runs behind a proxy that overwrites these headers; otherwise any client could
 * set them. Without a trusted proxy all callers share one bucket, which fails safe.
 */
export function clientIp(req: Request) {
  if (process.env.TRUST_PROXY !== "1") return "untrusted";

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const hops = req.headers.get("x-forwarded-for")?.split(",").map((h) => h.trim()).filter(Boolean);
  return hops?.at(-1) ?? "unknown";
}

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

/**
 * Fixed-window limiter. In-memory is fine for a single instance; move to
 * Redis/Upstash if we ever run more than one.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > MAX_BUCKETS) sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }
  return null;
}
