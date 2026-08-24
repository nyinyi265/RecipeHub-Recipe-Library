"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RECIPES_PER_PAGE,
  recipes,
  type Recipe,
} from "@/lib/data/recipes";
import {
  FiltersSidebar,
  initialFilters,
  type FilterState,
} from "@/components/recipes/filters-sidebar";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { useMemo, useState } from "react";

export function RecipeDiscover() {
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(initialFilters);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = recipes.filter((recipe) => {
      if (
        appliedFilters.cuisine.length > 0 &&
        !appliedFilters.cuisine.includes(recipe.cuisine)
      ) {
        return false;
      }
      if (
        appliedFilters.difficulty.length > 0 &&
        !appliedFilters.difficulty.includes(recipe.difficulty)
      ) {
        return false;
      }
      if (
        appliedFilters.dietary.length > 0 &&
        !appliedFilters.dietary.every((diet) => recipe.dietary.includes(diet))
      ) {
        return false;
      }
      if (recipe.time > appliedFilters.maxTime) return false;
      if (recipe.calories > appliedFilters.maxCalories) return false;
      if (query && !recipe.title.toLowerCase().includes(query)) return false;
      return true;
    });

    switch (sortBy) {
      case "top-rated":
        return [...result].sort((a, b) => b.rating - a.rating);
      case "quickest":
        return [...result].sort((a, b) => a.time - b.time);
      default:
        return [...result].sort((a, b) => b.reviews - a.reviews);
    }
  }, [appliedFilters, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / RECIPES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visibleRecipes = filtered.slice(
    (currentPage - 1) * RECIPES_PER_PAGE,
    currentPage * RECIPES_PER_PAGE,
  );

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <FiltersSidebar
          appliedFilters={appliedFilters}
          onApply={(filters) => {
            setAppliedFilters(filters);
            setPage(1);
          }}
        />

        <section>
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search thousands of gourmet recipes..."
              className="h-12 rounded-full border-slate-200 bg-white pl-11 text-sm shadow-sm"
            />
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filtered.length}
              </span>{" "}
              recipes
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Sort by:</span>
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-[140px] rounded-full border-slate-200 bg-white text-sm shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="top-rated">Top Rated</SelectItem>
                  <SelectItem value="quickest">Quickest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {visibleRecipes.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleRecipes.map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-white py-20 text-center shadow-sm ring-1 ring-slate-100">
              <p className="font-semibold text-slate-900">No recipes found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your filters or search term.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-8 flex items-center justify-center gap-2"
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="size-9 rounded-full border-slate-200"
              >
                &lsaquo;
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Page ${pageNumber}`}
                    aria-current={pageNumber === currentPage ? "page" : undefined}
                    onClick={() => setPage(pageNumber)}
                    className={
                      pageNumber === currentPage
                        ? "size-9 rounded-full border-orange-600 bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
                        : "size-9 rounded-full border-slate-200 text-slate-600 hover:text-orange-600"
                    }
                  >
                    {pageNumber}
                  </Button>
                ),
              )}
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="size-9 rounded-full border-slate-200"
              >
                &rsaquo;
              </Button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
