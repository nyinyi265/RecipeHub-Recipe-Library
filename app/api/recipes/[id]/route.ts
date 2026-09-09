import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAuth } from "@/lib/auth/session";
import { createRecipeSchema } from "@/lib/validations/recipe";
import {
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "@/services/recipe/recipe.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipe = await getRecipeById(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    console.error("Fetch recipe error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    if (session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update recipes." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const input = createRecipeSchema.parse(body);

    const existing = await getRecipeById(id);
    if (!existing) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
    }

    const recipe = await updateRecipe(id, input);

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? "Invalid recipe data.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (error instanceof Error) {
      console.error("Recipe update error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update recipe." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    if (session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete recipes." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existing = await getRecipeById(id);
    if (!existing) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
    }

    await deleteRecipe(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete recipe error:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe." },
      { status: 500 }
    );
  }
}
