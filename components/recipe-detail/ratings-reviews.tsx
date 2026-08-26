import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

interface RatingsReviewsProps {
  overallRating: number;
  totalReviews: number;
  ratingBreakdown: { stars: number; count: number; percentage: number }[];
  categoryRatings: { label: string; rating: number }[];
  reviews: Review[];
}

export function RatingsReviews({
  overallRating,
  totalReviews,
  ratingBreakdown,
  categoryRatings,
  reviews,
}: RatingsReviewsProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900">Ratings & Reviews</h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-slate-900">{overallRating}</span>
            <span className="text-sm text-slate-500">out of 5</span>
          </div>

          <div className="space-y-2">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="w-8 text-sm text-slate-600">{item.stars} ★</span>
                <Progress value={item.percentage} className="h-2 flex-1" />
                <span className="w-8 text-right text-sm text-slate-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Rate this Recipe</h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button">
                <Star className="size-6 fill-slate-200 text-slate-200 transition-colors hover:fill-orange-500 hover:text-orange-500" />
              </button>
            ))}
          </div>
          <Textarea placeholder="Share your experience with this recipe..." className="min-h-[100px]" />
          <Button className="bg-orange-600 text-white hover:bg-orange-700">Submit Review</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Rating by Category</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {categoryRatings.map((cat) => (
            <div key={cat.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">{cat.label}</span>
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-orange-500 text-orange-500" />
                <span className="text-sm font-medium text-slate-700">{cat.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Recent Reviews</h3>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-orange-100 text-orange-700">
                    {review.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{review.name}</span>
                    <span className="text-xs text-slate-400">{review.date}</span>
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-3.5 ${
                          star <= review.rating
                            ? "fill-orange-500 text-orange-500"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
