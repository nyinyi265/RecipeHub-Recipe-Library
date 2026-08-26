import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser } from "@/lib/auth/session";
import { RecipeDetailHero } from "@/components/recipe-detail/recipe-detail-hero";
import { RatingsReviews } from "@/components/recipe-detail/ratings-reviews";
import { PreparationSteps } from "@/components/recipe-detail/preparation-steps";
import { CommunityFeedback } from "@/components/recipe-detail/community-feedback";

export const metadata = {
  title: "Recipe Details | RecipeHub",
  description: "View recipe details, preparation steps, and reviews.",
};

const sampleRecipe = {
  title: "Roasted Harvest Chicken with Root Vegetables",
  chef: "Nathan Mitchell",
  image:
    "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1200&q=80",
  rating: 4.8,
  reviewCount: 52,
  prepTime: "20 min",
  cookTime: "1 hr",
  servings: 4,
  calories: 650,
  description:
    "A comforting one-pan roast featuring juicy chicken thighs and caramelized root vegetables, seasoned with rosemary and thyme for a perfect family dinner.",
};

const sampleRatingBreakdown = [
  { stars: 5, count: 34, percentage: 65 },
  { stars: 4, count: 12, percentage: 23 },
  { stars: 3, count: 4, percentage: 8 },
  { stars: 2, count: 1, percentage: 2 },
  { stars: 1, count: 1, percentage: 2 },
];

const sampleCategoryRatings = [
  { label: "Taste", rating: 4.9 },
  { label: "Texture", rating: 4.7 },
  { label: "Ease of Preparation", rating: 4.6 },
  { label: "Presentation", rating: 4.8 },
];

const sampleReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    date: "2 days ago",
    comment:
      "Absolutely delicious! The chicken was perfectly juicy and the vegetables were caramelized beautifully. My family loved it.",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 4,
    date: "1 week ago",
    comment:
      "Great recipe! I added some extra garlic and it turned out amazing. Will definitely make again.",
  },
  {
    id: 3,
    name: "Emma Davis",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "This is now my go-to weeknight dinner. Easy to prepare and absolutely flavorful.",
  },
];

const sampleSteps = [
  {
    number: 1,
    title: "Prep the Chicken",
    description:
      "Pat chicken thighs dry with paper towels. Season generously with salt, pepper, rosemary, and thyme. Let sit at room temperature for 15 minutes.",
    image:
      "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80",
  },
  {
    number: 2,
    title: "Cook the Vegetables",
    description:
      "Toss cubed potatoes, carrots, and onions with olive oil, salt, and pepper. Spread evenly on a large sheet pan.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  },
  {
    number: 3,
    title: "Perfect internal temperature",
    description:
      "Roast at 425°F for 45 minutes until chicken reaches an internal temperature of 165°F and vegetables are golden brown.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
];

const sampleFeedbacks = [
  {
    id: 1,
    name: "Lisa Thompson",
    date: "3 days ago",
    comment:
      "Made this for Sunday dinner and everyone asked for seconds. The rosemary really makes it special!",
  },
  {
    id: 2,
    name: "James Wilson",
    date: "1 week ago",
    comment:
      "Simple yet elegant. I served it with a side salad and crusty bread. Perfect!",
  },
];

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F2]">
      <Navbar isAuthenticated={Boolean(user)} userName={user?.name} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <RecipeDetailHero {...sampleRecipe} />
          <RatingsReviews
            overallRating={sampleRecipe.rating}
            totalReviews={sampleRecipe.reviewCount}
            ratingBreakdown={sampleRatingBreakdown}
            categoryRatings={sampleCategoryRatings}
            reviews={sampleReviews}
          />
          <PreparationSteps steps={sampleSteps} />
          <CommunityFeedback feedbacks={sampleFeedbacks} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
