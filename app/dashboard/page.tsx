import { FeaturedCategories } from "@/components/dashboard/featured-categories";
import { HeroSection } from "@/components/dashboard/hero-section";
import { Testimonials } from "@/components/dashboard/testimonials";
import { TrendingRecipes } from "@/components/dashboard/trending-recipes";
import { Footer } from "@/components/layout/footer";
import { requireAuth } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Heart, Users, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar isAuthenticated={Boolean(session.user)} />
        <main className="flex-1">
          <HeroSection />
          <FeaturedCategories />
          <TrendingRecipes />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </>
  );
}
