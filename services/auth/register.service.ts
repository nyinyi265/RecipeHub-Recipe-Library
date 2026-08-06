import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import type { RegisterInput } from "@/lib/validations/register";

/**
 * Creates a credentials-based user account.
 */
export async function registerUser(
  input: RegisterInput,
  profileImageUrl?: string,
) {
  const normalizedEmail = input.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    if (existing.password) {
      throw new Error("An account with this email already exists.");
    }

    throw new Error(
      "This email is already registered with Google. Sign in with Google instead.",
    );
  }

  const hashedPassword = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      name: input.name,
      email: normalizedEmail,
      password: hashedPassword,
      gender: input.gender,
      country: input.country || null,
      profile: profileImageUrl ?? null,
      image: profileImageUrl ?? null,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}
