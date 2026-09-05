import Image from "next/image";
import { Star, Clock, Users, Flame, ChefHat, Bookmark } from "lucide-react";

interface RecipeDetailHeroProps {
  title: string;
  chef: string;
  image: string;
  rating: number;
  reviewCount: number;
  prepTime: string;
  cookTime: string;
  servings: number;
  calories: number;
  description: string;
}

export function RecipeDetailHero({
  title,
  chef,
  image,
  rating,
  reviewCount,
  prepTime,
  cookTime,
  servings,
  calories,
  description,
}: RecipeDetailHeroProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-center gap-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            by <span className="font-medium text-slate-700">{chef}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-5 ${
                  star <= Math.round(rating)
                    ? "fill-orange-500 text-orange-500"
                    : "fill-slate-200 text-slate-200"
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold text-slate-700">{rating}</span>
          <span className="text-sm text-slate-400">({reviewCount} reviews)</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm text-orange-700">
            <Clock className="size-4" />
            <span>Prep: {prepTime}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm text-orange-700">
            <Clock className="size-4" />
            <span>Cook: {cookTime}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm text-orange-700">
            <Users className="size-4" />
            <span>{servings} servings</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm text-orange-700">
            <Flame className="size-4" />
            <span>{calories} kcal</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">{description}</p>

        <div className="flex items-center gap-3 mt-2">
          <button className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600 transition-colors cursor-pointer shadow-sm">
            <ChefHat className="size-4" />
            Start Cooking
          </button>
          <button className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
            <Bookmark className="size-4" />
            Save Recipe
          </button>
        </div>
      </div>
    </section>
  );
}
