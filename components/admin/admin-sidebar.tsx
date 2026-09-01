"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"

interface AdminSidebarProps {
  user: {
    name?: string | null
  }
}

const navLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Recipes", href: "/admin/recipes", icon: UtensilsCrossed },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col bg-slate-900 text-white">
      <div className="flex items-center gap-2 border-b border-slate-700 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
          R
        </div>
        <div>
          <span className="text-lg font-bold tracking-wide">RecipeHub</span>
          <p className="text-xs text-slate-400">{user.name || "Admin"}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href)
          const Icon = link.icon
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-700 px-3 py-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </aside>
  )
}
