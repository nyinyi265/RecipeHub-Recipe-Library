import { prisma } from "@/lib/prisma";
import type { CreateRecipeInput } from "@/lib/validations/recipe";

/**
 * Maps form difficulty values to database enum values.
 */
function mapDifficulty(difficulty: string): "EASY" | "INTERMEDIATE" | "EXPERT" {
  const map: Record<string, "EASY" | "INTERMEDIATE" | "EXPERT"> = {
    Easy: "EASY",
    Intermediate: "INTERMEDIATE",
    Expert: "EXPERT",
  };
  return map[difficulty] ?? "EASY";
}

/**
 * Maps form status values to database enum values.
 */
function mapStatus(status: string): "DRAFT" | "PUBLISHED" | "PRIVATE" {
  const map: Record<string, "DRAFT" | "PUBLISHED" | "PRIVATE"> = {
    draft: "DRAFT",
    published: "PUBLISHED",
    private: "PRIVATE",
  };
  return map[status] ?? "DRAFT";
}

/**
 * Generates a URL-friendly slug from a title.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Fetch Functions ─────────────────────────────────────────────────────────

/**
 * Returns all published recipes with their categories, for the public discover page.
 */
export async function getPublishedRecipes() {
  return prisma.recipe.findMany({
    where: { status: "PUBLISHED" },
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Returns all recipes for the admin list page (any status).
 */
export async function getAllRecipes() {
  return prisma.recipe.findMany({
    include: {
      categories: true,
      recipe_ingredients: true,
      recipe_steps: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Returns a single recipe by ID with all relations.
 */
export async function getRecipeById(id: string) {
  return prisma.recipe.findUnique({
    where: { id },
    include: {
      categories: true,
      recipe_ingredients: { orderBy: { display_order: "asc" } },
      recipe_steps: { orderBy: { step_no: "asc" } },
    },
  });
}

/**
 * Returns a single recipe by slug with all relations.
 */
export async function getRecipeBySlug(slug: string) {
  return prisma.recipe.findUnique({
    where: { slug },
    include: {
      categories: true,
      recipe_ingredients: { orderBy: { display_order: "asc" } },
      recipe_steps: { orderBy: { step_no: "asc" } },
    },
  });
}

/**
 * Returns published recipes for the trending section (top rated).
 */
export async function getTrendingRecipes(limit = 4) {
  return prisma.recipe.findMany({
    where: { status: "PUBLISHED" },
    include: { categories: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Returns all categories.
 */
export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

/**
 * Returns recipes pending moderation (non-published).
 */
export async function getPendingRecipes() {
  return prisma.recipe.findMany({
    where: { status: { not: "PUBLISHED" } },
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Create ──────────────────────────────────────────────────────────────────

/**
 * Creates a new recipe with all related data (ingredients, steps, category).
 * Uses nested creates for efficiency.
 */
export async function createRecipe(input: CreateRecipeInput) {
  const slug = generateSlug(input.title);

  // Find or create the category
  let categoryId: string | undefined;
  if (input.category) {
    const existingCategory = await prisma.category.findUnique({
      where: { name: input.category },
    });

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const newCategory = await prisma.category.create({
        data: { name: input.category },
      });
      categoryId = newCategory.id;
    }
  }

  // Flatten ingredient groups into individual ingredients with group_name
  const allIngredients = input.ingredientGroups.flatMap((group) =>
    group.ingredients.map((ingredient, index) => ({
      name: ingredient.name,
      qty: parseInt(ingredient.qty, 10) || 0,
      unit: ingredient.unit,
      notes: ingredient.prepNotes || null,
      group_name: group.name,
      display_order: index,
    }))
  );

  // Map instructions to recipe steps
  const recipeSteps = input.instructions.map((instruction, index) => ({
    step_no: index + 1,
    instruction: instruction.text,
    image_url: instruction.imageUrl || null,
  }));

  // Create recipe with all related data using nested creates
  const recipe = await prisma.recipe.create({
    data: {
      title: input.title,
      slug,
      description: input.description || null,
      cover_image: input.coverImage || null,
      difficulty: mapDifficulty(input.difficulty),
      status: mapStatus(input.status),
      featured: input.featured,
      search_visibility: input.searchVisibility,
      allow_comments: input.allowComments,
      ...(categoryId && {
        categories: {
          connect: { id: categoryId },
        },
      }),
      recipe_ingredients: {
        create: allIngredients,
      },
      recipe_steps: {
        create: recipeSteps,
      },
    },
    include: {
      categories: true,
      recipe_ingredients: true,
      recipe_steps: true,
    },
  });

  return recipe;
}
