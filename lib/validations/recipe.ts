import { z } from "zod";

const difficultyValues = ["Easy", "Intermediate", "Expert"] as const;
const statusValues = ["draft", "published", "private"] as const;

const ingredientSchema = z.object({
  id: z.string(),
  qty: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  name: z.string().min(1, "Ingredient name is required"),
  prepNotes: z.string().optional(),
});

const ingredientGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Group name is required"),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
});

const instructionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Instruction is required"),
  imageUrl: z.string().optional(),
});

export const createRecipeSchema = z.object({
  title: z.string().trim().min(1, "Recipe name is required").max(255),
  description: z.string().max(200).optional(),
  category: z.string().optional(),
  coverImage: z.string().optional(),
  difficulty: z.enum(difficultyValues).default("Easy"),
  status: z.enum(statusValues).default("draft"),
  featured: z.boolean().default(false),
  searchVisibility: z.boolean().default(true),
  allowComments: z.boolean().default(true),
  instructions: z.array(instructionSchema).min(1, "At least one instruction is required"),
  ingredientGroups: z.array(ingredientGroupSchema).min(1, "At least one ingredient group is required"),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
