import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser } from "@/lib/auth/session";
import { getRecipeById } from "@/services/recipe/recipe.service";
import { RecipeDetailHero } from "@/components/recipe-detail/recipe-detail-hero";
import { IngredientsList } from "@/components/recipe-detail/ingredients-list";
import { RatingsReviews } from "@/components/recipe-detail/ratings-reviews";
import { PreparationSteps } from "@/components/recipe-detail/preparation-steps";
import { CommunityFeedback } from "@/components/recipe-detail/community-feedback";

export const metadata = {
  title: "Recipe Details | RecipeHub",
  description: "View recipe details, preparation steps, and reviews.",
};

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;

  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  const heroProps = {
    title: recipe.title,
    chef: "RecipeHub Chef",
    image: recipe.cover_image || "/images/login.png",
    rating: 4.8,
    reviewCount: 0,
    prepTime: recipe.prep_time ? String(recipe.prep_time) : "N/A",
    cookTime: recipe.cook_time ? String(recipe.cook_time) : "N/A",
    servings: recipe.servings,
    calories: recipe.Calories,
    description: recipe.description || "",
  };

  const steps =
    recipe.recipe_steps?.map((step) => ({
      number: step.step_no,
      title: `Step ${step.step_no}`,
      description: step.instruction,
      image: step.image_url || "",
    })) || [];

  const ingredients =
    recipe.recipe_ingredients?.map((ing) => ({
      id: ing.id,
      name: ing.name,
      qty: ing.qty,
      unit: ing.unit,
      notes: ing.notes,
      group_name: ing.group_name,
    })) || [];

  const categoryName = recipe.categories?.[0]?.name || null;

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F2]">
      <Navbar isAuthenticated={Boolean(user)} userName={user?.name} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Category & Difficulty Badge */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryName && (
              <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                {categoryName}
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {recipe.difficulty}
            </span>
            {recipe.featured && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                Featured
              </span>
            )}
          </div>

          <RecipeDetailHero {...heroProps} />

          {ingredients.length > 0 && (
            <IngredientsList ingredients={ingredients} />
          )}

          <PreparationSteps steps={steps.filter((s) => s.description)} />

          <RatingsReviews
            overallRating={4.8}
            totalReviews={0}
            ratingBreakdown={[
              { stars: 5, count: 0, percentage: 0 },
              { stars: 4, count: 0, percentage: 0 },
              { stars: 3, count: 0, percentage: 0 },
              { stars: 2, count: 0, percentage: 0 },
              { stars: 1, count: 0, percentage: 0 },
            ]}
            categoryRatings={[]}
            reviews={[]}
          />

          <CommunityFeedback feedbacks={[]} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
