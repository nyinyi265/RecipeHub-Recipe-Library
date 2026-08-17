import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "RecipeHub turned weeknight cooking from a chore into something I actually look forward to. The meal plans are a lifesaver.",
    name: "Amelia Brooks",
    location: "Austin, TX",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote:
      "I found my go-to pasta and a whole new set of vegan dinners in the first week. The community ratings are spot on.",
    name: "Noah Patel",
    location: "Seattle, WA",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote:
      "Beautiful recipes, clear steps, and shopping lists that actually match what I cook. This is the only food app I keep open.",
    name: "Lina Ortega",
    location: "Miami, FL",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80",
  },
];

export function Testimonials() {
  return (
    <section className="bg-[#F8F9FA] py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          What Our Cooks Say
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="flex flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-orange-500 text-orange-500"
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                {item.quote}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">{item.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
