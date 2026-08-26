import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { requireAuth } from "@/lib/auth/session";
import { WeeklyGrid } from "@/components/meal-planner/weekly-grid";
import { PlannerSidebar } from "@/components/meal-planner/planner-sidebar";

export const metadata = {
  title: "Weekly Meal Planner | RecipeHub",
  description:
    "Design your week, track your macros, and shop with confidence.",
};

export default async function MealPlannerPage() {
  const session = await requireAuth();
  const user = session.user;

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F2]">
      <Navbar isAuthenticated={true} userName={user?.name} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Weekly Meal Planner
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Design your week, track your macros, and shop with confidence.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <WeeklyGrid />
          <PlannerSidebar />
        </div>
      </main>
      <Footer />
    </div>
  );
}
