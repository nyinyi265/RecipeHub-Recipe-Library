"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import {
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Check,
  GripVertical,
  ImagePlus,
  CircleCheck,
  Loader2,
  Pencil,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/upload"

const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "Ingredients" },
  { number: 3, label: "Instructions" },
  { number: 4, label: "Visuals" },
  { number: 5, label: "Review" },
]

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Baking",
  "Appetizer",
  "Soup",
  "Salad",
]

const difficulties = ["Easy", "Intermediate", "Expert"] as const
const units = ["lbs", "oz", "g", "kg", "ml", "L", "cup", "tbsp", "tsp", "piece", "slice"]

type Status = "draft" | "published" | "private"

interface Ingredient {
  id: string
  qty: string
  unit: string
  name: string
  prepNotes: string
}

interface IngredientGroup {
  id: string
  name: string
  ingredients: Ingredient[]
}

interface RecipeData {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image: string | null
  gallery_images: string[]
  prep_time: string | null
  cook_time: string | null
  difficulty: string
  status: string
  featured: boolean
  search_visibility: boolean
  allow_comments: boolean
  categories: { name: string }[]
  recipe_ingredients: {
    id: string
    name: string
    qty: number
    unit: string
    notes: string | null
    group_name: string
    display_order: number
  }[]
  recipe_steps: {
    id: string
    step_no: number
    instruction: string
    image_url: string | null
  }[]
}

function mapDifficultyToFrontend(db: string): "Easy" | "Intermediate" | "Expert" {
  const map: Record<string, "Easy" | "Intermediate" | "Expert"> = {
    EASY: "Easy",
    INTERMEDIATE: "Intermediate",
    EXPERT: "Expert",
  }
  return map[db] ?? "Easy"
}

function mapStatusToFrontend(db: string): Status {
  const map: Record<string, Status> = {
    PUBLISHED: "published",
    DRAFT: "draft",
    PRIVATE: "private",
  }
  return map[db] ?? "draft"
}

function parseTimeToMinutes(time: Date | string | null): number {
  if (!time) return 0
  if (time instanceof Date) {
    return time.getUTCHours() * 60 + time.getUTCMinutes()
  }
  const parts = time.split(":")
  if (parts.length >= 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1])
  }
  return 0
}

export default function EditRecipePage() {
  const router = useRouter()
  const params = useParams()
  const recipeId = params.id as string

  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recipeName, setRecipeName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState<"Easy" | "Intermediate" | "Expert">("Easy")
  const [status, setStatus] = useState<Status>("draft")
  const [featured, setFeatured] = useState(false)
  const [searchVisibility, setSearchVisibility] = useState(true)
  const [allowComments, setAllowComments] = useState(true)

  const [instructions, setInstructions] = useState([
    { id: "1", text: "" },
  ])

  const [stepImages, setStepImages] = useState<Record<string, string | null>>({})
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [prepTime, setPrepTime] = useState<number>(0)
  const [cookTime, setCookTime] = useState<number>(0)

  const [ingredientGroups, setIngredientGroups] = useState<IngredientGroup[]>([
    {
      id: "1",
      name: "Main Ingredients",
      ingredients: [{ id: "1", qty: "", unit: "g", name: "", prepNotes: "" }],
    },
  ])

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${recipeId}`)
        const data = await res.json()
        if (!data.success || !data.recipe) {
          toast.error("Recipe not found.")
          router.push("/admin/recipes")
          return
        }
        const recipe: RecipeData = data.recipe

        setRecipeName(recipe.title)
        setDescription(recipe.description ?? "")
        setDifficulty(mapDifficultyToFrontend(recipe.difficulty))
        setStatus(mapStatusToFrontend(recipe.status))
        setFeatured(recipe.featured)
        setSearchVisibility(recipe.search_visibility)
        setAllowComments(recipe.allow_comments)
        setHeroImage(recipe.cover_image)
        setGalleryImages(recipe.gallery_images ?? [])
        setPrepTime(parseTimeToMinutes(recipe.prep_time))
        setCookTime(parseTimeToMinutes(recipe.cook_time))

        if (recipe.categories?.[0]) {
          setCategory(recipe.categories[0].name)
        }

        // Map ingredients into groups
        const groupMap = new Map<string, Ingredient[]>()
        for (const ing of recipe.recipe_ingredients) {
          const key = ing.group_name || "Main Ingredients"
          if (!groupMap.has(key)) groupMap.set(key, [])
          groupMap.get(key)!.push({
            id: ing.id,
            qty: String(ing.qty),
            unit: ing.unit,
            name: ing.name,
            prepNotes: ing.notes ?? "",
          })
        }

        if (groupMap.size > 0) {
          const groups: IngredientGroup[] = Array.from(groupMap.entries()).map(
            ([name, ingredients], i) => ({
              id: String(i + 1),
              name,
              ingredients,
            })
          )
          setIngredientGroups(groups)
        }

        // Map instructions
        if (recipe.recipe_steps.length > 0) {
          const sorted = recipe.recipe_steps.sort((a, b) => a.step_no - b.step_no)
          setInstructions(
            sorted.map((s) => ({
              id: s.id,
              text: s.instruction,
            }))
          )
          const imagesMap: Record<string, string | null> = {}
          for (const s of sorted) {
            if (s.image_url) {
              imagesMap[s.id] = s.image_url
            }
          }
          setStepImages(imagesMap)
        }
      } catch {
        toast.error("Failed to load recipe.")
        router.push("/admin/recipes")
      } finally {
        setLoading(false)
      }
    }
    fetchRecipe()
  }, [recipeId, router])

  async function handleHeroImageChange(file: File | null) {
    if (file) {
      try {
        const url = await uploadImage(file)
        setHeroImage(url)
      } catch {
        toast.error("Failed to upload hero image.")
      }
    } else {
      setHeroImage(null)
    }
  }

  async function handleGalleryImageAdd(file: File) {
    if (galleryImages.length >= 4) return
    try {
      const url = await uploadImage(file)
      setGalleryImages((prev) => [...prev, url])
    } catch {
      toast.error("Failed to upload gallery image.")
    }
  }

  function handleGalleryImageRemove(index: number) {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleStepImageChange(stepId: string, file: File | null) {
    if (file) {
      try {
        const url = await uploadImage(file)
        setStepImages((prev) => ({ ...prev, [stepId]: url }))
      } catch {
        toast.error("Failed to upload step image.")
      }
    } else {
      setStepImages((prev) => ({ ...prev, [stepId]: null }))
    }
  }

  const addInstruction = () => {
    setInstructions([...instructions, { id: Date.now().toString(), text: "" }])
  }

  const updateInstruction = (id: string, text: string) => {
    setInstructions(instructions.map((i) => (i.id === id ? { ...i, text } : i)))
  }

  const removeInstruction = (id: string) => {
    setInstructions(instructions.filter((i) => i.id !== id))
  }

  const addIngredientGroup = () => {
    const newGroup: IngredientGroup = {
      id: Date.now().toString(),
      name: `Group ${ingredientGroups.length + 1}`,
      ingredients: [{ id: Date.now().toString(), qty: "", unit: "lbs", name: "", prepNotes: "" }],
    }
    setIngredientGroups([...ingredientGroups, newGroup])
  }

  const removeIngredientGroup = (groupId: string) => {
    setIngredientGroups(ingredientGroups.filter((g) => g.id !== groupId))
  }

  const addIngredient = (groupId: string) => {
    setIngredientGroups(
      ingredientGroups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              ingredients: [
                ...g.ingredients,
                { id: Date.now().toString(), qty: "", unit: "lbs", name: "", prepNotes: "" },
              ],
            }
          : g
      )
    )
  }

  const updateIngredient = (groupId: string, ingredientId: string, field: keyof Ingredient, value: string) => {
    setIngredientGroups(
      ingredientGroups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              ingredients: g.ingredients.map((i) =>
                i.id === ingredientId ? { ...i, [field]: value } : i
              ),
            }
          : g
      )
    )
  }

  const removeIngredient = (groupId: string, ingredientId: string) => {
    setIngredientGroups(
      ingredientGroups.map((g) =>
        g.id === groupId
          ? { ...g, ingredients: g.ingredients.filter((i) => i.id !== ingredientId) }
          : g
      )
    )
  }

  async function handleSubmit(recipeStatus: "published" | "private") {
    if (!recipeName.trim()) {
      toast.error("Recipe name is required.")
      setCurrentStep(1)
      return
    }

    const hasValidIngredient = ingredientGroups.some((g) =>
      g.ingredients.some((ing) => ing.name.trim())
    )
    if (!hasValidIngredient) {
      toast.error("At least one ingredient with a name is required.")
      setCurrentStep(2)
      return
    }

    const hasValidInstruction = instructions.some((i) => i.text.trim())
    if (!hasValidInstruction) {
      toast.error("At least one instruction is required.")
      setCurrentStep(3)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recipeName,
          description: description || undefined,
          category: category || undefined,
          difficulty,
          status: recipeStatus,
          featured,
          searchVisibility,
          allowComments,
          coverImage: heroImage || undefined,
          galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
          prepTime: prepTime || undefined,
          cookTime: cookTime || undefined,
          instructions: instructions.filter((i) => i.text.trim()).map((i) => ({
            ...i,
            imageUrl: stepImages[i.id] || undefined,
          })),
          ingredientGroups: ingredientGroups.map((g) => ({
            ...g,
            ingredients: g.ingredients.filter((ing) => ing.name.trim()),
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update recipe.")
      }

      toast.success("Recipe updated successfully!")
      router.push("/admin/recipes")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStep1Valid = recipeName.trim().length > 0
  const isStep2Valid = ingredientGroups.some((g) =>
    g.ingredients.some((ing) => ing.name.trim())
  )
  const isStep3Valid = instructions.some((i) => i.text.trim())

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/recipes" className="hover:text-slate-700">Recipes</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 font-medium">Edit Recipe</span>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/admin/recipes" className="hover:text-slate-700">
          Recipes
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 font-medium">Edit Recipe</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Edit Recipe <span className="text-orange-500">{recipeName}</span>
        </h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  currentStep > step.number
                    ? "bg-green-500 text-white"
                    : currentStep === step.number
                      ? "bg-orange-500 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep >= step.number ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 mx-3 ${
                  currentStep > step.number ? "bg-green-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex gap-6 flex-1 pb-6">
        {/* Left Column - Form */}
        <div className="flex-1">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            {currentStep === 1 && (
              <>
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Recipe Basics
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Recipe Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      placeholder="e.g. Classic Margherita Pizza"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Short Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                      placeholder="A brief, appetizing description of the dish..."
                      rows={4}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none"
                    />
                    <p className="text-right text-xs text-slate-400 mt-1">
                      {description.length}/200 characters
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      >
                        <option value="">Select Category...</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Difficulty
                      </label>
                      <div className="flex gap-2">
                        {difficulties.map((d) => (
                          <button
                            key={d}
                            onClick={() => setDifficulty(d)}
                            className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-colors ${
                              difficulty === d
                                ? "border-orange-500 bg-orange-50 text-orange-600"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Prep Time (min)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={prepTime || ""}
                        onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Cook Time (min)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={cookTime || ""}
                        onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Total Time
                      </label>
                      <div className="h-10 w-full rounded-lg border border-slate-100 bg-slate-50 px-3 flex items-center text-sm text-slate-500">
                        {prepTime + cookTime > 0 ? `${prepTime + cookTime} min` : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Ingredient Groups
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Organize ingredients into logical sections.
                </p>

                <div className="space-y-4">
                  {ingredientGroups.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-lg border border-slate-200 bg-slate-50/50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between bg-orange-50/50 px-4 py-3 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-slate-400 cursor-move" />
                          <span className="text-sm font-medium text-slate-900">
                            {group.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeIngredientGroup(group.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="text-xs font-medium text-slate-500 uppercase">
                              <th className="text-left pb-2 w-20">QTY</th>
                              <th className="text-left pb-2 w-28">UNIT</th>
                              <th className="text-left pb-2">INGREDIENT NAME</th>
                              <th className="text-left pb-2 w-36">PREP NOTES (OPT.)</th>
                              <th className="pb-2 w-10"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.ingredients.map((ingredient) => (
                              <tr key={ingredient.id}>
                                <td className="pr-2 py-1">
                                  <input
                                    type="text"
                                    value={ingredient.qty}
                                    onChange={(e) =>
                                      updateIngredient(group.id, ingredient.id, "qty", e.target.value)
                                    }
                                    placeholder="0"
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                  />
                                </td>
                                <td className="pr-2 py-1">
                                  <select
                                    value={ingredient.unit}
                                    onChange={(e) =>
                                      updateIngredient(group.id, ingredient.id, "unit", e.target.value)
                                    }
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                  >
                                    {units.map((u) => (
                                      <option key={u} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="pr-2 py-1">
                                  <input
                                    type="text"
                                    value={ingredient.name}
                                    onChange={(e) =>
                                      updateIngredient(group.id, ingredient.id, "name", e.target.value)
                                    }
                                    placeholder="Ingredient name"
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                  />
                                </td>
                                <td className="pr-2 py-1">
                                  <input
                                    type="text"
                                    value={ingredient.prepNotes}
                                    onChange={(e) =>
                                      updateIngredient(group.id, ingredient.id, "prepNotes", e.target.value)
                                    }
                                    placeholder="e.g. diced"
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                  />
                                </td>
                                <td className="py-1">
                                  <button
                                    onClick={() => removeIngredient(group.id, ingredient.id)}
                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          onClick={() => addIngredient(group.id)}
                          className="flex items-center gap-1.5 mt-3 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          Add Ingredient
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addIngredientGroup}
                  className="flex items-center justify-center gap-2 w-full mt-4 rounded-lg border-2 border-dashed border-slate-300 bg-white py-3 text-sm font-medium text-slate-600 hover:border-orange-400 hover:text-orange-500 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add New Group
                </button>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Step-by-Step Instructions
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Break down the cooking process into clear, manageable steps.
                </p>

                <div className="space-y-4">
                  {instructions.map((step, index) => (
                    <div
                      key={step.id}
                      className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                    >
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={step.text}
                            onChange={(e) => updateInstruction(step.id, e.target.value)}
                            placeholder="Describe this step..."
                            rows={3}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none"
                          />
                          {stepImages[step.id] ? (
                            <div className="mt-2 relative inline-block">
                              <img
                                src={stepImages[step.id]!}
                                alt={`Step ${index + 1} preview`}
                                className="h-24 w-24 rounded-lg object-cover border border-slate-200"
                              />
                              <button
                                onClick={() => handleStepImageChange(step.id, null)}
                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center gap-1.5 mt-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
                              <ImagePlus className="h-4 w-4" />
                              Add Step Image
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] ?? null
                                  handleStepImageChange(step.id, file)
                                  e.target.value = ""
                                }}
                              />
                            </label>
                          )}
                        </div>
                        <button
                          onClick={() => removeInstruction(step.id)}
                          className="p-1 h-fit text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addInstruction}
                    className="flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-slate-300 bg-white py-3 text-sm font-medium text-slate-600 hover:border-orange-400 hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Step
                  </button>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Media Management
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Upload high-quality visuals to make your recipe stand out.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hero Image
                  </label>
                  {heroImage ? (
                    <div className="relative inline-block">
                      <img
                        src={heroImage}
                        alt="Hero preview"
                        className="w-full max-h-64 rounded-lg object-cover border border-slate-200"
                      />
                      <button
                        onClick={() => handleHeroImageChange(null)}
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 py-12 hover:border-orange-400 transition-colors cursor-pointer">
                      <div className="text-center">
                        <p className="text-sm text-slate-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          PNG, JPG or WEBP (max. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null
                          handleHeroImageChange(file)
                          e.target.value = ""
                        }}
                      />
                    </label>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Secondary Images (Gallery)
                    </label>
                    <span className="text-xs text-slate-400">{galleryImages.length}/4 images</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {galleryImages.map((url, index) => (
                      <div key={url} className="relative aspect-square">
                        <img
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full rounded-lg object-cover border border-slate-200"
                        />
                        <button
                          onClick={() => handleGalleryImageRemove(index)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {galleryImages.length < 4 && (
                      <label className="flex items-center justify-center aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 hover:border-orange-400 hover:bg-orange-50/50 transition-colors cursor-pointer">
                        <Plus className="h-6 w-6 text-slate-400" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleGalleryImageAdd(file)
                            e.target.value = ""
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Review & Save
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                    <CircleCheck className="h-3.5 w-3.5" />
                    Ready to Save
                  </span>
                </div>

                {/* Basics Section */}
                <div className="rounded-lg border border-slate-200 bg-white p-5 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-900">Basics</h3>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Recipe Title</p>
                      <p className="text-sm font-medium text-slate-900">{recipeName || "—"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Category</p>
                        <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                          {category || "Uncategorized"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Difficulty</p>
                        <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                          {difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">⏱️</span>
                        <span className="text-xs text-slate-500">Prep Time:</span>
                        <span className="text-sm font-medium text-slate-900">{prepTime > 0 ? `${prepTime} mins` : "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">🔥</span>
                        <span className="text-xs text-slate-500">Cook Time:</span>
                        <span className="text-sm font-medium text-slate-900">{cookTime > 0 ? `${cookTime} mins` : "—"}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Description</p>
                      <p className="text-sm text-slate-700">{description || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Ingredients Section */}
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-900">Ingredients</h3>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </div>
                  {ingredientGroups.map((group) => (
                    <div key={group.id} className="mb-3 last:mb-0">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {group.name}
                      </span>
                      <table className="w-full text-sm mt-2">
                        <tbody>
                          {group.ingredients.map((ing) => (
                            <tr key={ing.id} className="border-b border-slate-100">
                              <td className="py-2 text-slate-900">{ing.qty} {ing.unit}</td>
                              <td className="py-2 text-slate-900">{ing.name}</td>
                              <td className="py-2 text-slate-500">{ing.prepNotes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="w-80">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            {currentStep === 5 ? (
              <>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Publishing Settings
                </h3>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Visibility
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "published" as Status, label: "Public", desc: "Visible to everyone on the platform and in search results." },
                      { value: "private" as Status, label: "Private / Draft", desc: "Only visible to administrators." },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                          status === option.value
                            ? "border-orange-500 bg-orange-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={status === option.value}
                          onChange={(e) => setStatus(e.target.value as Status)}
                          className="mt-0.5 h-4 w-4 accent-orange-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{option.label}</p>
                          <p className="text-xs text-slate-500">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleSubmit("published")}
                    disabled={isSubmitting || !isStep1Valid || !isStep2Valid || !isStep3Valid}
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save & Publish"}
                  </button>
                  <button
                    onClick={() => handleSubmit("private")}
                    disabled={isSubmitting || !isStep1Valid || !isStep2Valid || !isStep3Valid}
                    className="flex items-center justify-center gap-2 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save as Private"}
                  </button>
                  <button
                    onClick={() => router.push("/admin/recipes")}
                    className="flex items-center justify-center w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900">
                    <span className="text-xs text-white">⚙</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Administrative Publishing Settings
                  </h3>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "published" as Status, label: "Published", desc: "Live and visible to everyone" },
                      { value: "private" as Status, label: "Private", desc: "Only visible via direct link" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                          status === option.value
                            ? "border-orange-500 bg-orange-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={status === option.value}
                          onChange={(e) => setStatus(e.target.value as Status)}
                          className="mt-0.5 h-4 w-4 accent-orange-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{option.label}</p>
                          <p className="text-xs text-slate-500">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Featured Recipe</p>
                      <p className="text-xs text-slate-500">Highlight on homepage</p>
                    </div>
                    <button
                      onClick={() => setFeatured(!featured)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        featured ? "bg-orange-500" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          featured ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Search Visibility</p>
                      <p className="text-xs text-slate-500">Appear in search results</p>
                    </div>
                    <button
                      onClick={() => setSearchVisibility(!searchVisibility)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        searchVisibility ? "bg-orange-500" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          searchVisibility ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Allow Comments</p>
                      <p className="text-xs text-slate-500">Enable user comments</p>
                    </div>
                    <button
                      onClick={() => setAllowComments(!allowComments)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        allowComments ? "bg-orange-500" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          allowComments ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-end mt-8 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-10">
          {currentStep > 1 && (
            <Button
              variant="outline"
              className="gap-2 cursor-pointer"
              onClick={() => setCurrentStep((s) => s - 1)}
            >
              <ArrowLeft className="h-4 w-4" />
              {currentStep === 4 ? "Back to Instructions" : currentStep === 5 ? "Back to Visuals" : "Previous Step"}
            </Button>
          )}
          {currentStep < 5 && (
            <Button
              className="gap-2 bg-orange-500 text-white hover:bg-orange-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                (currentStep === 1 && !isStep1Valid) ||
                (currentStep === 2 && !isStep2Valid) ||
                (currentStep === 3 && !isStep3Valid)
              }
              onClick={() => setCurrentStep((s) => Math.min(s + 1, 5))}
            >
              {currentStep === 4 ? "Next: Review & Save" : "Next Step"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
