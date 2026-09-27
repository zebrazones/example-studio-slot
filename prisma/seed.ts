import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const templates = [
  { title: "Morning Flow Yoga", instructor: "Maya Chen", room: "Studio A", hour: 7, durationMin: 60, capacity: 16 },
  { title: "HIIT Express", instructor: "Jordan Reyes", room: "Studio B", hour: 12, durationMin: 30, capacity: 20 },
  { title: "Reformer Pilates", instructor: "Sofia Laurent", room: "Reformer Room", hour: 17, durationMin: 50, capacity: 8 },
  { title: "Spin & Burn", instructor: "Jordan Reyes", room: "Cycle Room", hour: 18, durationMin: 45, capacity: 24 },
  { title: "Yin Yoga", instructor: "Maya Chen", room: "Studio A", hour: 19, durationMin: 75, capacity: 16 },
];

async function main() {
  const ownerPassword = process.env.SEED_OWNER_PASSWORD;
  if (!ownerPassword || ownerPassword.length < 12) {
    throw new Error("Set SEED_OWNER_PASSWORD (12+ characters) before seeding.");
  }
  const passwordHash = await bcrypt.hash(ownerPassword, 12);
  await prisma.user.upsert({
    where: { email: "owner@studioslots.app" },
    update: {},
    create: { email: "owner@studioslots.app", name: "Studio Owner", passwordHash, role: "STAFF" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 0; day < 14; day++) {
    for (const t of templates) {
      const startsAt = new Date(today);
      startsAt.setDate(today.getDate() + day);
      startsAt.setHours(t.hour);
      await prisma.studioClass.create({
        data: {
          title: t.title,
          instructor: t.instructor,
          room: t.room,
          startsAt,
          durationMin: t.durationMin,
          capacity: t.capacity,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
