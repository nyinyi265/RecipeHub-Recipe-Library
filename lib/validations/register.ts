import { z } from "zod";

export const genderValues = [
  "MALE",
  "FEMALE",
  "OTHER",
  "PREFER_NOT_TO_SAY",
] as const;

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  gender: z.enum(genderValues).optional(),
  country: z.string().trim().max(100).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
