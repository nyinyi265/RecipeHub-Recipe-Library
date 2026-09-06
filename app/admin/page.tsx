"use client"

import { useEffect, useState } from "react"
import {
  Users,
  UtensilsCrossed,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  AlertCircle,
  Database,
  Megaphone,
} from "lucide-react"

interface ModerationRecipe {
  id: string
  title: string
  slug: string
  cover_image: string | null
  status: "DRAFT" | "PUBLISHED" | "PRIVATE"
  createdAt: string
}

export default function AdminDashboardPage() {
  const [moderationQueue, setModerationQueue] = useState<ModerationRecipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPending() {
      try {
        const res = await fetch("/api/recipes?type=all")
        const data = await res.json()
        if (data.success) {
          // Show non-published recipes in moderation queue
          const pending = data.recipes.filter(
            (r: ModerationRecipe) => r.status !== "PUBLISHED"
          )
          setModerationQueue(pending.slice(0, 5))
        }
      } catch (error) {
        console.error("Failed to fetch pending recipes:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPending()
  }, [])

  const stats = [
    {
      label: "TOTAL RECIPES",
      value: moderationQueue.length.toString(),
      trend: "From database",
      trendUp: true,
      icon: UtensilsCrossed,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      label: "PENDING MODERATION",
      value: moderationQueue.length.toString(),
      trend: moderationQueue.length > 0 ? "Requires attention" : "All clear",
      trendUp: false,
      warning: moderationQueue.length > 0,
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      label: "TOTAL ACTIVE USERS",
      value: "--",
      trend: "Coming soon",
      trendUp: true,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "PLATFORM TRAFFIC",
      value: "--",
      trend: "Coming soon",
      trendUp: true,
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ]

  const alerts = [
    {
      title: "System Ready",
      description: "Recipe management system is active and operational.",
      time: "Now",
      icon: Database,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
    },
  ]

  const statusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "Published"
      case "DRAFT": return "Pending"
      case "PRIVATE": return "Flagged"
      default: return status
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="mt-1 text-slate-500">
          Platform performance and moderation queue for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${stat.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {stat.warning ? (
                  <>
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">{stat.trend}</span>
                  </>
                ) : stat.trendUp ? (
                  <>
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">{stat.trend}</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-3 w-3 text-slate-500" />
                    <span className="text-slate-500">{stat.trend}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recipe Moderation Queue */}
        <div className="col-span-1 rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Recipe Moderation Queue
            </h2>
            <a
              href="/admin/recipes"
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              View All <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
                ))}
              </div>
            ) : moderationQueue.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-medium text-slate-900">No pending recipes</p>
                <p className="mt-1 text-sm text-slate-500">
                  All recipes have been reviewed.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Recipe Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {moderationQueue.map((recipe) => (
                    <tr
                      key={recipe.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                            {recipe.cover_image ? (
                              <img
                                src={recipe.cover_image}
                                alt={recipe.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                N/A
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{recipe.title}</p>
                            <p className="text-xs text-slate-500">{recipe.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            recipe.status === "DRAFT"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {statusLabel(recipe.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent System Alerts */}
        <div className="col-span-1 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent System Alerts
            </h2>
          </div>
          <div className="space-y-1 p-4">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <div
                  key={index}
                  className="flex gap-3 rounded-lg p-3 hover:bg-slate-50"
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${alert.iconBg}`}
                  >
                    <Icon className={`h-4 w-4 ${alert.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {alert.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {alert.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
