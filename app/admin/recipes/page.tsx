"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Download,
  Star,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
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
  coverImage: string
  author: {
    name: string
    image: string | null
  }
  category: string
  views: number
  rating: number
  status: "Active" | "Pending" | "Flagged"
}

const adminRecipes: AdminRecipe[] = [
  {
    id: "RCP-001",
    title: "Creamy Tomato Basil Soup",
    slug: "creamy-tomato-basil-soup",
    coverImage:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=100&q=80",
    author: {
      name: "Sarah Jenkins",
      image: null,
    },
    category: "Dinner",
    views: 12450,
    rating: 4.8,
    status: "Active",
  },
  {
    id: "RCP-002",
    title: "Rustic Artisan Sourdough",
    slug: "rustic-artisan-sourdough",
    coverImage:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&q=80",
    author: {
      name: "Mike Baker",
      image: null,
    },
    category: "Baking",
    views: 3120,
    rating: 4.5,
    status: "Pending",
  },
  {
    id: "RCP-003",
    title: "Spicy Tuna Poke Bowl",
    slug: "spicy-tuna-poke-bowl",
    coverImage:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80",
    author: {
      name: "David Kim",
      image: null,
    },
    category: "Lunch",
    views: 8900,
    rating: 4.9,
    status: "Flagged",
  },
  {
    id: "RCP-004",
    title: "Glazed Atlantic Salmon Bowl",
    slug: "glazed-atlantic-salmon-bowl",
    coverImage:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=100&q=80",
    author: {
      name: "Emily Chen",
      image: null,
    },
    category: "Dinner",
    views: 15230,
    rating: 4.8,
    status: "Active",
  },
  {
    id: "RCP-005",
    title: "Spiced Chickpea Power Bowl",
    slug: "spiced-chickpea-power-bowl",
    coverImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80",
    author: {
      name: "Priya Sharma",
      image: null,
    },
    category: "Lunch",
    views: 9870,
    rating: 4.9,
    status: "Active",
  },
  {
    id: "RCP-006",
    title: "Traditional Carbonara",
    slug: "traditional-carbonara",
    coverImage:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=100&q=80",
    author: {
      name: "Marco Rossi",
      image: null,
    },
    category: "Dinner",
    views: 18400,
    rating: 4.7,
    status: "Active",
  },
  {
    id: "RCP-007",
    title: "Thai Green Curry",
    slug: "thai-green-curry",
    coverImage:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=100&q=80",
    author: {
      name: "Nina Patel",
      image: null,
    },
    category: "Dinner",
    views: 11200,
    rating: 4.7,
    status: "Pending",
  },
  {
    id: "RCP-008",
    title: "Artisan Margherita Pizza",
    slug: "artisan-margherita-pizza",
    coverImage:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=100&q=80",
    author: {
      name: "Luca Romano",
      image: null,
    },
    category: "Dinner",
    views: 21500,
    rating: 4.9,
    status: "Active",
  },
]

const categories = ["All Categories", "Dinner", "Lunch", "Baking", "Breakfast", "Dessert"]
const statuses = ["All Statuses", "Active", "Pending", "Flagged"]

const ITEMS_PER_PAGE = 5

export default function AdminRecipesPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [status, setStatus] = useState("All Statuses")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  const filteredRecipes = useMemo(() => {
    return adminRecipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory =
        category === "All Categories" || recipe.category === category
      const matchesStatus =
        status === "All Statuses" || recipe.status === status
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [search, category, status])

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
      case "Active":
        return "default"
      case "Pending":
        return "secondary"
      case "Flagged":
        return "destructive"
      default:
        return "outline"
    }
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
        <Button className="gap-2 bg-orange-500 text-white hover:bg-orange-600">
          <Plus className="h-4 w-4" />
          Create New Recipe
        </Button>
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
                {s}
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
                Author
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Views
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rating
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
                      <Image
                        src={recipe.coverImage}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {recipe.title}
                      </p>
                      <p className="text-xs text-slate-400">{recipe.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                      {recipe.author.image ? (
                        <Image
                          src={recipe.author.image}
                          alt={recipe.author.name}
                          width={28}
                          height={28}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        recipe.author.name.charAt(0)
                      )}
                    </div>
                    <span className="text-sm text-slate-700">
                      {recipe.author.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{recipe.category}</Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {recipe.views.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-slate-700">
                      {recipe.rating}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(recipe.status)}>
                    {recipe.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
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
      </div>
    </div>
  )
}
