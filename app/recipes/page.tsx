import { RecipeDiscover } from "@/components/recipes/recipe-discover";
import { Footer } from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/navbar";

export const metadata = {
  title: "Discover Recipes | RecipeHub",
  description: "Search and filter thousands of gourmet recipes.",
};

export default async function RecipePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F2]">
      <Navbar isAuthenticated={Boolean(user)} userName={user?.name} />
      <main className="flex-1">
        <RecipeDiscover />
      </main>
      <Footer />
    </div>
  );
}
