import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser } from "@/lib/auth/session";
import { getRecipeById } from "@/services/recipe/recipe.service";
import { RecipeDetailHero } from "@/components/recipe-detail/recipe-detail-hero";
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
      image: step.image_url || "/images/login.png",
    })) || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F2]">
      <Navbar isAuthenticated={Boolean(user)} userName={user?.name} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <RecipeDetailHero {...heroProps} />
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
          <PreparationSteps steps={steps} />
          <CommunityFeedback feedbacks={[]} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
