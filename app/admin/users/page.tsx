"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Search,
  Download,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  FileText,
  Ban,
  Key,
  Activity,
  AlertTriangle,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  role: "Chef" | "Creator" | "Admin" | "User"
  status: "Active" | "Pending" | "Suspended"
  recipes?: number
  followers?: string
  rating?: number
  joined?: string
}

const users: User[] = [
  {
    id: "1",
    name: "Chef Mario Batalli",
    email: "mario@imaginary.com",
    avatar: null,
    role: "Chef",
    status: "Active",
    recipes: 156,
    followers: "42.8k",
    rating: 4.95,
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@email.com",
    avatar: null,
    role: "Creator",
    status: "Active",
  },
  {
    id: "3",
    name: "Diana Cruz",
    email: "diana.c@email.com",
    avatar: null,
    role: "User",
    status: "Active",
  },
  {
    id: "4",
    name: "Florian Renzi",
    email: "florian.r@email.com",
    avatar: null,
    role: "Chef",
    status: "Pending",
  },
  {
    id: "5",
    name: "Jessica Oliver",
    email: "jessica.o@email.com",
    avatar: null,
    role: "Creator",
    status: "Active",
  },
  {
    id: "6",
    name: "Alex Chan",
    email: "alex.chan@email.com",
    avatar: null,
    role: "User",
    status: "Suspended",
  },
]

const tabs = [
  { label: "All Users", count: 128420 },
  { label: "Chefs & Creators", count: 1240 },
  { label: "Staff & Admins", count: 15 },
  { label: "Pending Verifications", count: 192 },
  { label: "Flagged Accounts", count: 38 },
]

const stats = [
  { label: "Total Users", value: "128,420", change: "+18.2% vs last month", positive: true },
  { label: "Active Today", value: "18,290", change: "", positive: true },
  { label: "Chefs & Creators", value: "1,240", change: "", positive: true },
  { label: "Flagged Accounts", value: "38", change: "", positive: false },
]

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedUser, setSelectedUser] = useState<User | null>(users[0])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleAll = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(users.map((u) => u.id)))
    }
  }

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allSelected = selectedIds.size === users.length

  const roleBadge = (role: string) => {
    switch (role) {
      case "Chef":
        return "bg-orange-100 text-orange-700"
      case "Creator":
        return "bg-purple-100 text-purple-700"
      case "Admin":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700"
      case "Pending":
        return "bg-yellow-100 text-yellow-700"
      case "Suspended":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            User Management <span className="text-sm font-normal text-slate-400">128,420 total</span>
          </h1>
          <p className="text-sm text-slate-500">
            Monitor registered users, manage accounts, moderate user listings, review Chef verifications, and ensure platform integrity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="gap-2 bg-orange-500 text-white hover:bg-orange-600">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            {stat.change && (
              <p className={`text-xs mt-1 ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === index
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label} ({tab.count.toLocaleString()})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or @handle..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
        <button className="flex items-center gap-2 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
          Last Sort: Active
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-2 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
          Verified
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-2 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
          Location
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-2 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
          Chef, Cook...
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-2 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
          All Subscriptions
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-4 py-2">
          <p className="text-sm text-slate-700">
            <span className="font-medium">{selectedIds.size} User selected:</span>{" "}
            {Array.from(selectedIds).map((id) => users.find((u) => u.id === id)?.name).join(", ")}
          </p>
          <div className="flex items-center gap-2">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
              Change Role
            </button>
            <span className="text-slate-300">|</span>
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
              Report/Ban
            </button>
            <span className="text-slate-300">|</span>
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
              Suspend/Deactivate
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 rounded-lg border border-slate-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-orange-500"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`border-b border-slate-100 cursor-pointer transition-colors ${
                    selectedUser?.id === user.id ? "bg-orange-50/50" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      onChange={() => toggleRow(user.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-orange-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-600">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900">{user.name}</p>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${roleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
            <p className="text-sm text-slate-500">
              Showing 1-6 of 128,420 users
            </p>
            <div className="flex items-center gap-1">
              <button className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300" disabled>
                Previous
              </button>
              <button className="h-8 w-8 rounded bg-orange-500 text-sm font-medium text-white">
                1
              </button>
              <button className="h-8 w-8 rounded text-sm font-medium text-slate-600 hover:bg-slate-100">
                2
              </button>
              <button className="h-8 w-8 rounded text-sm font-medium text-slate-600 hover:bg-slate-100">
                3
              </button>
              <span className="text-slate-400">...</span>
              <button className="h-8 w-8 rounded text-sm font-medium text-slate-600 hover:bg-slate-100">
                293
              </button>
              <button className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* User Inspector Sidebar */}
        {selectedUser && (
          <div className="w-80 shrink-0">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">User Inspector</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="text-center mb-4">
                <div className="relative h-16 w-16 mx-auto mb-3 overflow-hidden rounded-full bg-slate-200">
                  {selectedUser.avatar ? (
                    <Image
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-600">
                      {selectedUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h4 className="text-base font-semibold text-slate-900">{selectedUser.name}</h4>
                <p className="text-xs text-slate-500 mt-1">Executive Chef | Culinary Creator</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Award-winning chef with over 15 years of experience in fine dining. Passionate about creating innovative recipes that blend traditional techniques.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-5 py-3 border-y border-slate-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">{selectedUser.recipes || 156}</p>
                  <p className="text-xs text-slate-500">Recipes</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">{selectedUser.followers || "42.8k"}</p>
                  <p className="text-xs text-slate-500">Followers</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <p className="text-lg font-bold text-slate-900">{selectedUser.rating || 4.95}</p>
                  </div>
                  <p className="text-xs text-slate-500">Avg Rating</p>
                </div>
              </div>

              {/* Training Record */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Chef&apos;s Training Record</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Menu Planning</span>
                    <span className="font-medium text-slate-900">Advanced</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Food Safety</span>
                    <span className="font-medium text-slate-900">Level 2</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Pastry Arts</span>
                    <span className="font-medium text-slate-900">Intermediate</span>
                  </div>
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Administrative Actions</h4>
                <div className="space-y-2">
                  <button className="flex items-center gap-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                    <Ban className="h-4 w-4 text-slate-500" />
                    Suspend
                  </button>
                  <button className="flex items-center gap-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                    <Trash2 className="h-4 w-4 text-slate-500" />
                    Delete User
                  </button>
                  <button className="flex items-center gap-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                    <Activity className="h-4 w-4 text-slate-500" />
                    Activity Log
                  </button>
                  <button className="flex items-center gap-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                    <Key className="h-4 w-4 text-slate-500" />
                    Reset Login
                  </button>
                </div>
              </div>

              {/* Report Activity */}
              <button className="flex items-center gap-2 w-full text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
                <AlertTriangle className="h-4 w-4" />
                Report Account Activity
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
          Support Portal
        </button>
      </div>
    </div>
  )
}
