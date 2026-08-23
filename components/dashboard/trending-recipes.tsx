"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const recipes = [
  {
    title: "Creamy Pasta Carbonara",
    difficulty: "Easy",
    rating: 4.8,
    reviews: 82,
    timeAgo: "2 hrs",
    author: "Elena Rossi",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
  },
  {
    title: "Garden Veggie Pizza",
    difficulty: "Easy",
    rating: 4.7,
    reviews: 64,
    timeAgo: "5 hrs",
    author: "Marcus Chen",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
  },
  {
    title: "Herb-Crusted Salmon",
    difficulty: "Easy",
    rating: 4.9,
    reviews: 91,
    timeAgo: "1 day",
    author: "Sofia Alvarez",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
  },
  {
    title: "Fluffy Berry Pancakes",
    difficulty: "Easy",
    rating: 4.6,
    reviews: 47,
    timeAgo: "2 days",
    author: "James Park",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
];

export function TrendingRecipes() {
  function scroll(direction: "left" | "right") {
    const scroller = document.getElementById("trending-scroller");
    if (!scroller) return;
    scroller.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
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
              key={recipe.title}
              className="w-[85%] shrink-0 snap-start overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 sm:w-[280px] lg:w-[calc(25%-0.95rem)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  sizes="(min-width:1024px) 25vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-[#2D6A4F] px-2.5 py-0.5 text-xs font-semibold text-white">
                  {recipe.difficulty}
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
                <h3 className="font-semibold text-slate-900">{recipe.title}</h3>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Star className="size-4 fill-orange-500 text-orange-500" />
                  <span className="font-medium text-slate-700">
                    {recipe.rating}
                  </span>
                  <span>({recipe.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarImage src={recipe.avatar} alt={recipe.author} />
                    <AvatarFallback>
                      {recipe.author.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-600">{recipe.author}</span>
                  <span className="ml-auto text-xs text-slate-400">
                    {recipe.timeAgo}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
