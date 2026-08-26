"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/lib/data/recipes";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#2D6A4F] px-2.5 py-0.5 text-xs font-semibold text-white">
          {recipe.isNew ? "NEW" : `${recipe.time} min`}
        </span>
        <button
          type="button"
          aria-label={`Save ${recipe.title} to favorites`}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition-colors hover:text-red-500"
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-slate-900">{recipe.title}</h3>
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="size-4 fill-orange-500 text-orange-500" />
          <span className="font-medium text-slate-700">{recipe.rating}</span>
          <span className="text-slate-400">({recipe.reviews})</span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
          {recipe.description}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <Link href={`/recipe/${recipe.id}/details`} className="flex-1">
            <Button className="h-9 w-full rounded-md bg-orange-600 text-sm text-white hover:bg-orange-700 cursor-pointer">
              Quick View
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Bookmark ${recipe.title}`}
            className="size-9 rounded-md border-slate-200 text-slate-500 hover:text-orange-600"
          >
            <Bookmark className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
