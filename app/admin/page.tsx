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
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "TOTAL ACTIVE USERS",
      value: "124.5k",
      trend: "+12% from last week",
      trendUp: true,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "NEW RECIPES TODAY",
      value: "842",
      trend: "+18% from yesterday",
      trendUp: true,
      icon: UtensilsCrossed,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      label: "PENDING MODERATION",
      value: "156",
      trend: "Requires immediate attention",
      trendUp: false,
      warning: true,
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      label: "PLATFORM TRAFFIC",
      value: "1.2M",
      trend: "+2.4% over 24h",
      trendUp: true,
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  const moderationQueue = [
    {
      name: "Rustic Tomato Basil Pasta",
      id: "#RC - 8923",
      author: "@chef_mario",
      submitted: "10 mins ago",
      status: "Pending",
      image: "/images/login.png",
    },
    {
      name: "Morning Energy Smoothie Bowl",
      id: "#RC - 8922",
      author: "@healthy_living",
      submitted: "45 mins ago",
      status: "Flagged",
      image: "/images/login.png",
    },
    {
      name: "Perfectly Seared Ribeye",
      id: "#RC - 8921",
      author: "@grillmaster_j",
      submitted: "1 hour ago",
      status: "Pending",
      image: "/images/login.png",
    },
  ];

  const alerts = [
    {
      title: "High Copyright Flag Rate",
      description: "Automated DMCA scanner flagged 14 recipes in the last 4 hours.",
      time: "10 mins ago",
      icon: AlertCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
    },
    {
      title: "Database Backup Complete",
      description: "Daily snapshot to AWS S3 completed successfully.",
      time: "2 hours ago",
      icon: Database,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      title: "Marketing Campaign Live",
      description: "Summer Grilling featured collection is now live on consumer frontend.",
      time: "5 hours ago",
      icon: Megaphone,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
    },
  ];

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
            <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900">
              View All <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Recipe Name</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Submitted</th>
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
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{recipe.name}</p>
                          <p className="text-xs text-slate-500">{recipe.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {recipe.author}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {recipe.submitted}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          recipe.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {recipe.status}
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
