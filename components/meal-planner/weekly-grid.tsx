import Image from "next/image";
import { Printer, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Meal {
  title: string;
  calories: number;
  image: string;
}

type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
type MealType = "Breakfast" | "Lunch" | "Dinner";

const DAYS: Day[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner"];

const mealLabels: Record<MealType, string> = {
  Breakfast: "wb_sunny BREAKFAST",
  Lunch: "lunch_dining LUNCH",
  Dinner: "dinner_dining DINNER",
};

const weeklyMeals: Record<Day, Record<MealType, Meal | null>> = {
  MON: {
    Breakfast: null,
    Lunch: null,
    Dinner: null,
  },
  TUE: {
    Breakfast: null,
    Lunch: {
      title: "Quinoa Bowl",
      calories: 520,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
    },
    Dinner: null,
  },
  WED: {
    Breakfast: {
      title: "Avocado Toast",
      calories: 320,
      image:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80",
    },
    Lunch: null,
    Dinner: null,
  },
  THU: {
    Breakfast: null,
    Lunch: null,
    Dinner: {
      title: "Grilled Salmon",
      calories: 680,
      image:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80",
    },
  },
  FRI: {
    Breakfast: null,
    Lunch: null,
    Dinner: null,
  },
  SAT: {
    Breakfast: null,
    Lunch: null,
    Dinner: null,
  },
  SUN: {
    Breakfast: null,
    Lunch: null,
    Dinner: null,
  },
};

const dailyCalories: Record<Day, number> = {
  MON: 0,
  TUE: 520,
  WED: 320,
  THU: 680,
  FRI: 0,
  SAT: 0,
  SUN: 0,
};

function MealCell({ meal }: { meal: Meal | null }) {
  if (!meal) {
    return <div className="flex h-full min-h-[80px] items-center justify-center" />;
  }

  return (
    <div className="flex h-full min-h-[80px] flex-col items-center gap-1 p-2">
      <div className="relative h-14 w-14 overflow-hidden rounded-lg">
        <Image
          src={meal.image}
          alt={meal.title}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <span className="text-center text-xs font-medium text-slate-700 line-clamp-1">
        {meal.title}
      </span>
      <span className="text-[10px] text-slate-400">{meal.calories} kcal</span>
    </div>
  );
}

export function WeeklyGrid() {
  return (
    <div className="flex-1">
      <div className="mb-4 flex items-center gap-3">
        <Button
          variant="outline"
          className="gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          <Printer className="size-4" />
          Print PDF
        </Button>
        <Button className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600">
          <ShoppingCart className="size-4" />
          Generate List
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr>
              <th className="w-[140px] border-b border-r border-slate-200 p-3" />
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="border-b border-r border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 last:border-r-0"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_TYPES.map((type, typeIdx) => (
              <tr key={type}>
                <td className="border-b border-r border-slate-200 px-3 py-2">
                  <span className="text-xs text-slate-500">
                    {mealLabels[type]}
                  </span>
                </td>
                {DAYS.map((day) => (
                  <td
                    key={`${day}-${type}`}
                    className="border-b border-r border-slate-200 last:border-r-0"
                  >
                    <MealCell meal={weeklyMeals[day][type]} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="border-b border-r border-slate-200 px-3 py-3">
                <span className="text-xs font-medium text-slate-600">
                  Daily Cal:
                </span>
              </td>
              {DAYS.map((day) => (
                <td
                  key={`cal-${day}`}
                  className="border-b border-r border-slate-200 px-4 py-3 text-center last:border-r-0"
                >
                  <span className="text-sm font-semibold text-slate-700">
                    {dailyCalories[day]}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
