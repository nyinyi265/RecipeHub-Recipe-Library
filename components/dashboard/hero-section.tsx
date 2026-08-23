import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[520px] overflow-hidden md:min-h-[600px]">
      <Image
        src="/images/login.png"
        alt="Fresh ingredients on a wooden kitchen table"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/15 to-white/10" />

      <div className="relative mx-auto flex min-h-[520px] w-full max-w-6xl flex-col px-6 py-6 md:min-h-[600px]">

        <div className="flex flex-1 flex-col justify-center py-16">
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Discover, Cook, and Share Amazing Recipes
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-white">
            Browse thousands of community-loved dishes, plan your week in
            minutes, and turn everyday ingredients into something worth sharing.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="h-11 rounded-lg bg-orange-500 px-6 text-sm font-semibold text-white hover:bg-orange-600"
            >
              <Link href="#trending">Browse Recipes</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg border-slate-800 bg-transparent px-6 text-sm font-semibold text-slate-900 hover:bg-white/70"
            >
              <Link href="#meal-planning">Try Meal Planning</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
