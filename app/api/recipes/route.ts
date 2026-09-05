import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAuth } from "@/lib/auth/session";
import { createRecipeSchema } from "@/lib/validations/recipe";
import { createRecipe } from "@/services/recipe/recipe.service";

export async function POST(request: Request) {
  try {
    // Require admin authentication
    const session = await requireAuth();
    if (session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create recipes." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const input = createRecipeSchema.parse(body);

    const recipe = await createRecipe(input);

    return NextResponse.json(
      { success: true, recipe },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? "Invalid recipe data.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (error instanceof Error) {
      console.error("Recipe creation error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create recipe." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
