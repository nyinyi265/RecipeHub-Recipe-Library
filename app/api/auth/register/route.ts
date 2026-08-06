import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { saveProfileImage } from "@/lib/upload/profile-image";
import { registerSchema } from "@/lib/validations/register";
import { registerUser } from "@/services/auth/register.service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const rawGender = formData.get("gender");
    const parsed = registerSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      gender:
        typeof rawGender === "string" && rawGender.length > 0
          ? rawGender
          : undefined,
      country: formData.get("country") || undefined,
    });

    const profileFile = formData.get("profile");
    let profileImageUrl: string | undefined;

    if (profileFile instanceof File && profileFile.size > 0) {
      profileImageUrl = await saveProfileImage(profileFile);
    }

    const user = await registerUser(parsed, profileImageUrl);

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? "Invalid registration data.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (error instanceof Error) {
      const status = error.message.includes("already")
        ? 409
        : error.message.includes("image")
          ? 400
          : 500;

      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
