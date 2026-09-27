import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(200),
});

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(200),
  password: z.string().min(8).max(200),
});

// Regulars book a whole series (e.g. every Morning Flow for the next weeks) in one go
export const createBookingSchema = z.object({
  classIds: z.array(z.string().cuid()).min(1),
});

export const createClassSchema = z.object({
  title: z.string().trim().min(1).max(80),
  instructor: z.string().trim().min(1).max(80),
  room: z.string().trim().min(1).max(40),
  startsAt: z.coerce.date(),
  durationMin: z.coerce.number().int().min(15).max(240),
  capacity: z.coerce.number().int().min(1).max(100),
});
