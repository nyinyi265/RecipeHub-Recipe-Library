import { FeaturedCategories } from "@/components/dashboard/featured-categories";
import { HeroSection } from "@/components/dashboard/hero-section";
import { Testimonials } from "@/components/dashboard/testimonials";
import { TrendingRecipes } from "@/components/dashboard/trending-recipes";
import { Footer } from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/navbar";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar isAuthenticated={Boolean(user)} />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCategories />
        <TrendingRecipes />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
