import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAuth } from "@/lib/auth/session";
import { createRecipeSchema } from "@/lib/validations/recipe";
import {
  createRecipe,
  getAllRecipes,
  getPublishedRecipes,
  getTrendingRecipes,
} from "@/services/recipe/recipe.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let recipes;

    if (type === "trending") {
      const limit = parseInt(searchParams.get("limit") ?? "4", 10);
      recipes = await getTrendingRecipes(limit);
    } else if (type === "all") {
      // Admin: require auth
      const session = await requireAuth();
      if (session.user?.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }
      recipes = await getAllRecipes();
    } else {
      // Public: published only
      recipes = await getPublishedRecipes();
    }

    return NextResponse.json({ success: true, recipes });
  } catch (error) {
    console.error("Fetch recipes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
