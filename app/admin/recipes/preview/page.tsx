"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Clock,
  Users,
  Flame,
  ChefHat,
  ArrowLeft,
  Share2,
  Printer,
  Bookmark,
  Check,
} from "lucide-react"

const ingredients = [
  {
    group: "The Beef",
    items: [
      { qty: "2 lbs", name: "Center-cut beef tenderloin", checked: false },
      { qty: "2 tbsp", name: "Olive oil", checked: false },
      { qty: "1 tsp", name: "Salt", checked: false },
      { qty: "½ tsp", name: "Black pepper", checked: false },
    ],
  },
  {
    group: "The Duxelles",
    items: [
      { qty: "1 lb", name: "Cremini mushrooms, finely chopped", checked: false },
      { qty: "4", name: "Shallots, minced", checked: false },
      { qty: "4 cloves", name: "Garlic, minced", checked: false },
      { qty: "2 tbsp", name: "Fresh thyme leaves", checked: false },
      { qty: "¼ cup", name: "Dry white wine", checked: false },
    ],
  },
  {
    group: "Assembly",
    items: [
      { qty: "6 slices", name: "Prosciutto di Parma", checked: false },
      { qty: "1 sheet", name: "Puff pastry, thawed", checked: false },
      { qty: "2", name: "Egg yolks (for egg wash)", checked: false },
    ],
  },
]

const steps = [
  {
    number: 1,
    title: "Sear the Tenderloin",
    text: "Heat olive oil in a large cast-iron skillet over high heat. Season the beef tenderloin generously with salt and pepper. Sear until deeply browned on all sides, about 2 minutes per side. This creates the flavorful crust that defines a great Wellington.",
    time: "15 mins",
  },
  {
    number: 2,
    title: "Prepare Mushroom Duxelles",
    text: "Finely chop the mushrooms and shallots. Cook in a dry pan over medium heat until all moisture has evaporated, about 10 minutes. Add garlic, thyme, and white wine. Cook until dry. Season and let cool completely.",
    time: "20 mins",
  },
  {
    number: 3,
    title: "Assemble & Prosciutto Wrap",
    text: "Lay out plastic wrap, arrange prosciutto slices in a rectangle, spread duxelles evenly. Place seared beef in center, roll tightly using plastic to form a log. Refrigerate for 30 minutes to set.",
    time: "10 mins",
  },
  {
    number: 4,
    title: "Bake to Golden Perfection",
    text: "Roll out puff pastry, wrap the beef log tightly, brush with egg wash. Score the top decoratively. Bake at 425°F (220°C) for 25-30 minutes until pastry is deep golden and internal temp reaches 125°F for medium-rare.",
    time: "2h 15mins",
  },
]

const nutrition = [
  { label: "Calories", value: "666 kcal" },
  { label: "Total Fat", value: "42g" },
  { label: "Protein", value: "58g" },
  { label: "Carbohydrates", value: "24g" },
  { label: "Sodium", value: "890mg" },
]

export default function RecipePreviewPage() {
  const [ingredientChecked, setIngredientChecked] = useState<Record<string, boolean>>({})

  const toggleIngredient = (key: string) => {
    setIngredientChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Preview Banner */}
      <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm">
            <span className="text-slate-400">Previewing recipe as</span>{" "}
            <span className="font-medium">&quot;Classic Beef Wellington&quot;</span>
          </p>
          <Link
            href="/admin/recipes/create"
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Exit Preview
          </Link>
        </div>
        <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors cursor-pointer">
          Publish Recipe
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 w-full">
        <Image
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
          alt="Classic Beef Wellington"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["BEEF", "MAIN DISH", "DINNER", "ADVANCED"].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Author */}
        <h1 className="text-4xl font-bold text-white mb-4">Classic Beef Wellington</h1>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-slate-300 overflow-hidden">
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-600">
              JD
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-white">James Donovan</p>
            <p className="text-xs text-slate-300">Posted 12/10/2023</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-8 text-white">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-300" />
            <div>
              <p className="text-xs text-slate-300">Prep Time</p>
              <p className="text-sm font-medium">2h 30m</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-300" />
            <div>
              <p className="text-xs text-slate-300">Cook Time</p>
              <p className="text-sm font-medium">45 mins</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-300" />
            <div>
              <p className="text-xs text-slate-300">Servings</p>
              <p className="text-sm font-medium">8 Servings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-slate-300" />
            <div>
              <p className="text-xs text-slate-300">Calories</p>
              <p className="text-sm font-medium">666 kcal</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-12">
          <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600 transition-colors cursor-pointer">
            <ChefHat className="h-5 w-5" />
            Start Cooking
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
            Start Cooking Mode
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Left Column - Ingredients & Nutrition */}
          <div className="lg:col-span-1 space-y-8">
            {/* Ingredients */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Ingredients</h2>
                <span className="text-xs text-slate-400">11 items</span>
              </div>

              <div className="space-y-4">
                {ingredients.map((group) => (
                  <div key={group.group}>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      {group.group}
                    </h3>
                    <div className="space-y-2">
                      {group.items.map((item, idx) => {
                        const key = `${group.group}-${idx}`
                        return (
                          <label
                            key={key}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <div
                              onClick={() => toggleIngredient(key)}
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                ingredientChecked[key]
                                  ? "bg-orange-500 border-orange-500"
                                  : "border-slate-300 bg-white"
                              } transition-colors`}
                            >
                              {ingredientChecked[key] && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm text-slate-600">{item.qty}</span>
                            <span className="text-sm text-slate-900">{item.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 mt-4 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                <span>Complete all items for grocery list</span>
              </button>
            </div>

            {/* Nutrition Facts */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Nutrition Facts</h2>
              <p className="text-xs text-slate-500 mb-4">Based on a 2,000 calorie diet. % Daily Values*</p>
              <div className="space-y-3">
                {nutrition.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="text-sm font-medium text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Steps */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Preparation Steps</h2>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-2">
                      {step.text}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {step.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 py-6 flex items-center justify-between">
          <Link
            href="/admin/recipes/create"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Editor
          </Link>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
              <Bookmark className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
