"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CUISINES,
  DIFFICULTIES,
  DIETARY,
  MAX_CALORIES,
  MAX_COOKING_TIME,
} from "@/lib/data/recipes";

export interface FilterState {
  cuisine: string[];
  difficulty: string[];
  dietary: string[];
  maxTime: number;
  maxCalories: number;
}

export const initialFilters: FilterState = {
  cuisine: [],
  difficulty: [],
  dietary: [],
  maxTime: MAX_COOKING_TIME,
  maxCalories: MAX_CALORIES,
};

interface FiltersSidebarProps {
  appliedFilters: FilterState;
  onApply: (filters: FilterState) => void;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      {children}
    </div>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        selected
          ? "rounded-full bg-orange-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-700"
          : "rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-orange-400 hover:text-orange-600"
      }
    >
      {label}
    </button>
  );
}

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function FiltersSidebar({ appliedFilters, onApply }: FiltersSidebarProps) {
  const [draft, setDraft] = useState<FilterState>(appliedFilters);
  const [prevApplied, setPrevApplied] = useState<FilterState>(appliedFilters);

  if (appliedFilters !== prevApplied) {
    setPrevApplied(appliedFilters);
    setDraft(appliedFilters);
  }

  const hasUnappliedChanges = JSON.stringify(draft) !== JSON.stringify(appliedFilters);

  function updateDraft(partial: Partial<FilterState>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  return (
    <aside className="h-fit rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:sticky lg:top-24">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        {hasUnappliedChanges && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(initialFilters);
              onApply(initialFilters);
            }}
            className="h-7 gap-1 rounded-full px-2.5 text-xs text-orange-600 hover:text-orange-700"
          >
            <X className="size-3.5" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <FilterSection title="Cuisine">
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((cuisine) => (
              <FilterChip
                key={cuisine}
                label={cuisine}
                selected={draft.cuisine.includes(cuisine)}
                onClick={() =>
                  updateDraft({ cuisine: toggleValue(draft.cuisine, cuisine) })
                }
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Difficulty">
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((difficulty) => (
              <FilterChip
                key={difficulty}
                label={difficulty}
                selected={draft.difficulty.includes(difficulty)}
                onClick={() =>
                  updateDraft({
                    difficulty: toggleValue(draft.difficulty, difficulty),
                  })
                }
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Cooking Time">
          <input
            type="range"
            min={10}
            max={MAX_COOKING_TIME}
            step={5}
            value={draft.maxTime}
            onChange={(e) => updateDraft({ maxTime: Number(e.target.value) })}
            aria-label="Maximum cooking time"
            className="w-full accent-orange-600"
          />
          <p className="text-xs font-medium text-slate-600">
            Up to {draft.maxTime} mins
          </p>
        </FilterSection>

        <FilterSection title="Dietary">
          <div className="flex flex-wrap gap-2">
            {DIETARY.map((diet) => (
              <FilterChip
                key={diet}
                label={diet}
                selected={draft.dietary.includes(diet)}
                onClick={() =>
                  updateDraft({ dietary: toggleValue(draft.dietary, diet) })
                }
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Max Calories">
          <Input
            type="number"
            min={0}
            max={MAX_CALORIES}
            placeholder={`Up to ${draft.maxCalories}`}
            value={draft.maxCalories === MAX_CALORIES ? "" : draft.maxCalories}
            onChange={(e) =>
              updateDraft({
                maxCalories: Number(e.target.value) || MAX_CALORIES,
              })
            }
            className="rounded-lg"
          />
        </FilterSection>
      </div>

      <Button
        type="button"
        onClick={() => onApply(draft)}
        className="mt-6 h-10 w-full rounded-lg bg-orange-600 text-sm font-semibold text-white hover:bg-orange-700"
      >
        Apply
      </Button>
    </aside>
  );
}
