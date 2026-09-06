"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Download,
  Star,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AdminRecipe {
  id: string
  title: string
  slug: string
  cover_image: string | null
  category: string
  status: "DRAFT" | "PUBLISHED" | "PRIVATE"
  Calories: number
  difficulty: string
  createdAt: string
  categories: { name: string }[]
}

const ITEMS_PER_PAGE = 5

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<AdminRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [status, setStatus] = useState("All Statuses")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("/api/recipes?type=all")
        const data = await res.json()
        if (data.success) {
          setRecipes(data.recipes)
        }
      } catch (error) {
        console.error("Failed to fetch recipes:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  const categories = useMemo(() => {
    const cats = new Set<string>(["All Categories"])
    recipes.forEach((r) => {
      r.categories?.forEach((c) => cats.add(c.name))
    })
    return Array.from(cats)
  }, [recipes])

  const statuses = ["All Statuses", "PUBLISHED", "DRAFT", "PRIVATE"]

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory =
        category === "All Categories" ||
        recipe.categories?.some((c) => c.name === category)
      const matchesStatus =
        status === "All Statuses" || recipe.status === status
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [search, category, status, recipes])

  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE)
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const allVisibleSelected =
    paginatedRecipes.length > 0 &&
    paginatedRecipes.every((r) => selectedRows.has(r.id))

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedRecipes.map((r) => r.id)))
    }
  }

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const statusVariant = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "default"
      case "DRAFT":
        return "secondary"
      case "PRIVATE":
        return "destructive"
      default:
        return "outline"
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "Published"
      case "DRAFT":
        return "Draft"
      case "PRIVATE":
        return "Private"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Recipe Management
            </h1>
            <p className="text-sm text-slate-500">Loading recipes...</p>
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Recipe Management
          </h1>
          <p className="text-sm text-slate-500">
            View, moderate, and manage all recipes on the platform.
          </p>
        </div>
        <Link
          href="/admin/recipes/create"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Create New Recipe
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>

        <Select
          value={category}
          onValueChange={(val) => {
            setCategory(val)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "All Statuses" ? s : statusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white">
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-l-lg p-2 transition-colors ${
                viewMode === "table"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-r-lg border-l border-slate-200 p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-slate-300"
                  checked={allVisibleSelected}
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Recipe Name
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Difficulty
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Calories
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecipes.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded border-slate-300"
                    checked={selectedRows.has(recipe.id)}
                    onChange={() => toggleRow(recipe.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {recipe.cover_image ? (
                        <Image
                          src={recipe.cover_image}
                          alt={recipe.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          N/A
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {recipe.title}
                      </p>
                      <p className="text-xs text-slate-400">{recipe.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {recipe.categories?.[0]?.name || recipe.category || "Uncategorized"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-600">
                    {recipe.difficulty}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {recipe.Calories}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(recipe.status)}>
                    {statusLabel(recipe.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/recipe/${recipe.id}/details`}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Star className="h-4 w-4" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredRecipes.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-semibold text-slate-900">No recipes found</p>
            <p className="mt-1 text-sm text-slate-500">
              Create your first recipe to get started.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecipes.length)} of{" "}
              {filteredRecipes.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-orange-500 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
