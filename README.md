# example-studio-slot

> **Sample repository. Do not deploy, and do not reuse this code.**
> This is a sample application for a [ZebraZones](https://www.zebrazones.com) security audit report with a **"Fix when you can"** verdict. It has no critical or high-risk issues, but it contains a few deliberate weaknesses so that the report has something real to point at.

StudioSlots is a small class-booking app for fitness studios, built with Cursor: Next.js 15 (App Router), Prisma and PostgreSQL, Tailwind CSS. Members browse the weekly schedule, book and cancel classes, and reset their password by email. Studio staff add classes and see who is coming.

## Running it locally

You need Node.js 20+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env   # set DATABASE_URL
npm run db:push
npm run db:seed        # two weeks of classes and a staff account (owner@studioslots.app, password printed once)
npm run dev
```

The app runs on http://localhost:3000. In development without `RESEND_API_KEY`, password reset emails are printed to the server console.

## About the audit

The findings, their impact and the fixes are described in the ZebraZones sample report. Want the same for your own app? Paste your repository at [zebrazones.com](https://www.zebrazones.com).
