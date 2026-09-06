"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Save,
  Eye,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Check,
  GripVertical,
  ImagePlus,
  Upload,
  Pencil,
  CircleCheck,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

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

export default function CreateRecipePage() {
  const router = useRouter()
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
    {
      id: "1",
      text: "",
    },
  ])

  const [stepImages, setStepImages] = useState<Record<string, string | null>>({})

  function handleStepImageChange(stepId: string, file: File | null) {
    if (file) {
      const url = URL.createObjectURL(file)
      setStepImages((prev) => ({ ...prev, [stepId]: url }))
    } else {
      setStepImages((prev) => ({ ...prev, [stepId]: null }))
    }
  }

  const addInstruction = () => {
    setInstructions([
      ...instructions,
      { id: Date.now().toString(), text: "" },
    ])
  }

  const updateInstruction = (id: string, text: string) => {
    setInstructions(instructions.map((i) => (i.id === id ? { ...i, text } : i)))
  }

  const removeInstruction = (id: string) => {
    setInstructions(instructions.filter((i) => i.id !== id))
  }

  const [ingredientGroups, setIngredientGroups] = useState<IngredientGroup[]>([
    {
      id: "1",
      name: "Main Ingredients",
      ingredients: [
        { id: "1", qty: "", unit: "g", name: "", prepNotes: "" },
      ],
    },
  ])

  const addIngredientGroup = () => {
    const newGroup: IngredientGroup = {
      id: Date.now().toString(),
      name: `Group ${ingredientGroups.length + 1}`,
      ingredients: [
        { id: Date.now().toString(), qty: "", unit: "lbs", name: "", prepNotes: "" },
      ],
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

  async function handleSubmit(recipeStatus: "draft" | "published" | "private") {
    if (!recipeName.trim()) {
      toast.error("Recipe name is required.")
      setCurrentStep(1)
      return
    }

    if (instructions.length === 0 || instructions.every((i) => !i.text.trim())) {
      toast.error("At least one instruction is required.")
      setCurrentStep(3)
      return
    }

    if (ingredientGroups.length === 0 || ingredientGroups.every((g) => g.ingredients.length === 0)) {
      toast.error("At least one ingredient is required.")
      setCurrentStep(2)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
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
          instructions: instructions.filter((i) => i.text.trim()),
          ingredientGroups: ingredientGroups.map((g) => ({
            ...g,
            ingredients: g.ingredients.filter((ing) => ing.name.trim()),
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create recipe.")
      }

      toast.success(
        recipeStatus === "published"
          ? "Recipe published successfully!"
          : "Recipe saved as draft."
      )
      router.push("/admin/recipes")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/admin/recipes" className="hover:text-slate-700">
          Recipes
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 font-medium">Create New Recipe</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">
            Create New Recipe <span className="text-orange-500">•Draft</span>
          </h1>
        </div>
        <p className="text-sm text-slate-400">Saved 2 minutes ago</p>
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
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Ingredient Groups
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Organize ingredients into logical sections (e.g., &quot;For the Dough&quot;, &quot;For the
                  Filling&quot;) to make the recipe easier to follow.
                </p>

                <div className="space-y-4">
                  {ingredientGroups.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-lg border border-slate-200 bg-slate-50/50 overflow-hidden"
                    >
                      {/* Group Header */}
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

                      {/* Ingredient Table */}
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
                  Break down the cooking process into clear, manageable steps. You
                  can add images to help users visualize the process.
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
                  Upload high-quality visuals to make your recipe stand out. Recommended
                  size: 1200x800px.
                </p>

                {/* Hero Image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hero Image
                  </label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 py-12 hover:border-orange-400 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PNG, JPG or WEBP (max. 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secondary Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Secondary Images (Gallery)
                    </label>
                    <span className="text-xs text-slate-400">0/4 images</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <button className="flex items-center justify-center aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 hover:border-orange-400 hover:bg-orange-50/50 transition-colors cursor-pointer">
                      <Plus className="h-6 w-6 text-slate-400" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                {/* Review Header */}
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Review & Publish
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                    <CircleCheck className="h-3.5 w-3.5" />
                    Ready for Review
                  </span>
                </div>

                {/* AI Validation */}
                <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-green-800">
                        All Validation Checks Passed
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        Your recipe data is complete and meets all required food
                        criteria.
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center gap-2 text-sm text-green-700">
                          <Check className="h-3.5 w-3.5" />
                          High-res images provided
                        </li>
                        <li className="flex items-center gap-2 text-sm text-green-700">
                          <Check className="h-3.5 w-3.5" />
                          Instructions clearly written
                        </li>
                      </ul>
                      <p className="text-xs text-slate-500 mt-2 italic">
                        Suggestion: Add 2-3 more tags for optimal discoverability.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basics Section */}
                <div className="rounded-lg border border-slate-200 bg-white p-5 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📝</span>
                      <h3 className="text-base font-semibold text-slate-900">Basics</h3>
                    </div>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors cursor-pointer">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Recipe Title</p>
                      <p className="text-sm font-medium text-slate-900">Classic Beef Wellington</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Category</p>
                        <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                          Main Course
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Difficulty</p>
                        <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                          Advanced
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">⏱️</span>
                        <span className="text-xs text-slate-500">Prep Time:</span>
                        <span className="text-sm font-medium text-slate-900">45 mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">🔥</span>
                        <span className="text-xs text-slate-500">Cook Time:</span>
                        <span className="text-sm font-medium text-slate-900">2h 15mins</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Description</p>
                      <p className="text-sm text-slate-700">
                        A classic British dish consisting of a beef tenderloin coated with pâté
                        and duxelles, wrapped in puff pastry. A show-stopping centerpiece for any
                        holiday meal.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ingredients Section */}
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🥘</span>
                      <h3 className="text-base font-semibold text-slate-900">Ingredients</h3>
                    </div>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors cursor-pointer">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-medium text-slate-500 uppercase border-b border-slate-200">
                        <th className="text-left pb-2">Qty</th>
                        <th className="text-left pb-2">Item</th>
                        <th className="text-left pb-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="pt-3 pb-1">
                          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            The Beef
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 text-slate-900">2 lbs</td>
                        <td className="py-2 text-slate-900">Center-cut beef tenderloin</td>
                        <td className="py-2 text-slate-500">Trimmed</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-900">2 tbsp</td>
                        <td className="py-2 text-slate-900">Olive oil</td>
                        <td className="py-2 text-slate-500">For searing</td>
                      </tr>
                    </tbody>
                  </table>
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
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Recipe"}
                  </button>
                  <button
                    onClick={() => handleSubmit("draft")}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save Draft & Exit"}
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
          {currentStep === 5 && (
            <Button variant="outline" className="gap-2 cursor-pointer" asChild>
              <Link href="/admin/recipes/preview" target="_blank">
                <Eye className="h-4 w-4" />
                Preview Recipe
              </Link>
            </Button>
          )}
          {currentStep < 5 && (
            <Button
              className="gap-2 bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
              onClick={() => setCurrentStep((s) => Math.min(s + 1, 5))}
            >
              {currentStep === 4 ? "Next: Review & Publish" : "Next Step"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
