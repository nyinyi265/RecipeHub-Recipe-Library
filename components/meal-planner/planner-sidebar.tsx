import Image from "next/image";
import { BarChart3, DollarSign } from "lucide-react";

interface QuickSuggestion {
  title: string;
  calories: number;
  image: string;
}

const weeklyStats = {
  totalCalories: 1930,
  goalCalories: 14000,
  protein: 85,
  carbs: 245,
  fat: 45,
};

const budgetEstimate = {
  cost: "$42.15",
  note: "Based on current market prices for your area",
};

const quickSuggestions: QuickSuggestion[] = [
  {
    title: "Greek Salad",
    calories: 320,
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=100&q=80",
  },
  {
    title: "Banana Oatmeal",
    calories: 280,
    image:
      "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=100&q=80",
  },
];

export function PlannerSidebar() {
  return (
    <aside className="w-full space-y-6 lg:w-[280px]">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="size-5 text-emerald-500" />
          <h3 className="font-semibold text-slate-900">Weekly stats</h3>
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-500">Total Calories</p>
          <p className="text-xl font-bold text-slate-900">
            {weeklyStats.totalCalories.toLocaleString()} /{" "}
            <span className="text-slate-400">
              {weeklyStats.goalCalories.toLocaleString()}
            </span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${(weeklyStats.totalCalories / weeklyStats.goalCalories) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500">Protein</p>
            <p className="text-sm font-bold text-slate-900">
              {weeklyStats.protein}g
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500">Carbs</p>
            <p className="text-sm font-bold text-slate-900">
              {weeklyStats.carbs}g
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500">Fat</p>
            <p className="text-sm font-bold text-slate-900">
              {weeklyStats.fat}g
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <DollarSign className="size-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-900">Budget Estimate</h3>
        </div>
        <p className="text-xs text-emerald-700">Estimated Grocery Cost</p>
        <p className="text-3xl font-bold text-emerald-800">
          {budgetEstimate.cost}
        </p>
        <p className="mt-1 text-xs text-emerald-600">{budgetEstimate.note}</p>
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          Optimise Shopping
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Quick Suggestions
        </h3>
        <div className="space-y-3">
          {quickSuggestions.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {item.title}
                </p>
                <p className="text-xs text-slate-400">{item.calories} kcal</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
