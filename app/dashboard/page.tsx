import { FeaturedCategories } from "@/components/dashboard/featured-categories";
import { HeroSection } from "@/components/dashboard/hero-section";
import { Testimonials } from "@/components/dashboard/testimonials";
import { TrendingRecipes } from "@/components/dashboard/trending-recipes";
import { Footer } from "@/components/layout/footer";
import { requireAuth } from "@/lib/auth/session";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        <HeroSection userName={session.user?.name} />
        <FeaturedCategories />
        <TrendingRecipes />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
