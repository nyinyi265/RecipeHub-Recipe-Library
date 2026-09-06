import { UtensilsCrossed } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  qty: number;
  unit: string;
  notes: string | null;
  group_name: string | null;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  const grouped = ingredients.reduce<Record<string, Ingredient[]>>((acc, ing) => {
    const group = ing.group_name || "Ingredients";
    if (!acc[group]) acc[group] = [];
    acc[group].push(ing);
    return acc;
  }, {});

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Ingredients</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-600">
              <UtensilsCrossed className="size-4" />
              {group}
            </h3>
            <ul className="space-y-2">
              {items.map((ing) => (
                <li key={ing.id} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-orange-400" />
                  <span>
                    {ing.qty > 0 && <span className="font-medium">{ing.qty} {ing.unit}</span>}
                    {ing.qty > 0 && " "}
                    {ing.name}
                    {ing.notes && <span className="text-slate-400"> — {ing.notes}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
