import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const featuredCategory = {
  name: "Breakfast",
  count: "70+ Recipes",
  image:
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80",
  alt: "Avocado toast with eggs",
};

const categories = [
  {
    name: "Lunch",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
    alt: "Fresh lunch salad bowl",
  },
  {
    name: "Dinner",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=700&q=80",
    alt: "Plated dinner with salmon",
  },
  {
    name: "Healthy",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=700&q=80",
    alt: "Healthy grain bowl",
  },
  {
    name: "Vegan",
    image:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=700&q=80",
    alt: "Colorful vegan dish",
  },
];

export function FeaturedCategories() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Featured Categories
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Find exactly what you&apos;re craving today.
            </p>
          </div>
          <Link
            href="#categories"
            className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            View All Categories
            <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_1.2fr]">
          <Link
            href="#categories"
            className="group relative min-h-[280px] overflow-hidden rounded-xl lg:min-h-[420px]"
          >
            <Image
              src={featuredCategory.image}
              alt={featuredCategory.alt}
              fill
              sizes="(min-width:1024px) 40vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-[#2D6A4F] px-3 py-1 text-xs font-semibold text-white">
              {featuredCategory.count}
            </span>
            <h3 className="absolute bottom-4 left-4 text-2xl font-semibold text-white">
              {featuredCategory.name}
            </h3>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href="#categories"
                className="group relative min-h-[160px] overflow-hidden rounded-xl lg:min-h-[202px]"
              >
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  sizes="(min-width:1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <h3 className="absolute bottom-3 left-3 text-lg font-semibold text-white">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
