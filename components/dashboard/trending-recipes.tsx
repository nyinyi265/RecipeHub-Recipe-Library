"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TrendingRecipe {
  id: string;
  title: string;
  difficulty: string;
  cover_image: string | null;
  Calories: number;
  categories: { name: string }[];
}

export function TrendingRecipes() {
  const [recipes, setRecipes] = useState<TrendingRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/recipes?type=trending&limit=4");
        const data = await res.json();
        if (data.success) {
          setRecipes(data.recipes);
        }
      } catch (error) {
        console.error("Failed to fetch trending recipes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  function scroll(direction: "left" | "right") {
    const scroller = document.getElementById("trending-scroller");
    if (!scroller) return;
    scroller.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  const difficultyLabel = (d: string) => {
    if (d === "EASY") return "Easy";
    if (d === "INTERMEDIATE") return "Intermediate";
    return "Expert";
  };

  if (loading) {
    return (
      <section id="trending" className="bg-white pb-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Trending This Week
            </h2>
          </div>
          <div className="flex gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-72 w-[280px] shrink-0 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section id="trending" className="bg-white pb-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Trending This Week
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              No recipes available yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="trending" className="bg-white pb-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Trending This Week
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The most loved recipes by our community right now.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous recipes"
              onClick={() => scroll("left")}
              className="size-9 rounded-full border-slate-200"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next recipes"
              onClick={() => scroll("right")}
              className="size-9 rounded-full border-slate-200"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div
          id="trending-scroller"
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {recipes.map((recipe) => (
            <article
              key={recipe.id}
              className="w-[85%] shrink-0 snap-start overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 sm:w-[280px] lg:w-[calc(25%-0.95rem)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {recipe.cover_image ? (
                  <Image
                    src={recipe.cover_image}
                    alt={recipe.title}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                    No Image
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-[#2D6A4F] px-2.5 py-0.5 text-xs font-semibold text-white">
                  {difficultyLabel(recipe.difficulty)}
                </span>
                <button
                  type="button"
                  aria-label={`Save ${recipe.title}`}
                  className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-colors hover:text-orange-500"
                >
                  <Heart className="size-4" />
                </button>
              </div>
              <div className="space-y-3 p-4">
                <h3 className="font-semibold text-slate-900">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Star className="size-4 fill-orange-500 text-orange-500" />
                  <span className="font-medium text-slate-700">
                    {recipe.Calories} cal
                  </span>
                </div>
                {recipe.categories?.[0] && (
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback>
                        {recipe.categories[0].name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-600">
                      {recipe.categories[0].name}
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
