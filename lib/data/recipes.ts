export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  category: string | null;
  difficulty: "EASY" | "INTERMEDIATE" | "EXPERT";
  status: "DRAFT" | "PUBLISHED" | "PRIVATE";
  servings: number;
  Calories: number;
  Protein: number;
  Carbs: number;
  Fat: number;
  createdAt: Date;
  categories?: { id: string; name: string }[];
  recipe_ingredients?: {
    id: string;
    name: string;
    qty: number;
    unit: string;
    notes: string | null;
    group_name: string | null;
    display_order: number;
  }[];
  recipe_steps?: {
    id: string;
    step_no: number;
    instruction: string;
    image_url: string | null;
  }[];
}

export const CUISINES = [
  "Indian",
  "Italian",
  "Mexican",
  "Thai",
  "Japanese",
] as const;

export const DIFFICULTIES = ["Easy", "Intermediate", "Expert"] as const;

export const DIETARY = ["Vegetarian", "Vegan", "Gluten-free"] as const;

export const MAX_COOKING_TIME = 120;
export const MAX_CALORIES = 1200;
export const RECIPES_PER_PAGE = 6;
