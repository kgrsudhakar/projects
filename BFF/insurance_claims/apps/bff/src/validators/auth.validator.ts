import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2).max(100),

  lastName: z.string().min(2).max(100),

  email: z.email(),

  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),

  phone: z.string().optional(),
  role: z.enum([
    "ADMIN",
    "AGENT",
    "CUSTOMER",
    "ADJUSTER"
  ])
});

export const loginSchema = z.object({
  email: z.email(),

  password: z.string().min(8)
});