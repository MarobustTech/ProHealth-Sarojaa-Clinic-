"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Stethoscope, Calendar, Settings, Activity, UserSquare2, ImageIcon, BarChart3 } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, color: "from-blue-600 to-cyan-500" },
  { name: "Analytics", href: "/admin/dashboard/analytics", icon: BarChart3, color: "from-purple-600 to-pink-500" },
  { name: "Doctors", href: "/admin/dashboard/doctors", icon: Users, color: "from-teal-600 to-emerald-500" },
  { name: "Patients", href: "/admin/dashboard/patients", icon: UserSquare2, color: "from-indigo-600 to-blue-500" },
  {
    name: "Specializations",
    href: "/admin/dashboard/specializations",
    icon: Stethoscope,
    color: "from-purple-600 to-pink-500",
  },
  {
    name: "Appointments",
    href: "/admin/dashboard/appointments",
    icon: Calendar,
    color: "from-orange-600 to-amber-500",
  },
  { name: "Banners", href: "/admin/dashboard/banners", icon: ImageIcon, color: "from-rose-600 to-pink-500" },
  { name: "Settings", href: "/admin/dashboard/settings", icon: Settings, color: "from-gray-600 to-slate-500" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full h-full min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-cyan-50/30 flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Sree Sarojaa Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              Sree Sarojaa
            </h1>
            <p className="text-xs text-gray-500 font-medium">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
                isActive
                  ? "bg-white shadow-lg scale-105"
                  : "text-gray-700 hover:bg-white/60 hover:shadow-md hover:scale-102",
              )}
            >
              {isActive && <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 rounded-xl`} />}
              <div
                className={cn(
                  "p-2 rounded-lg transition-all relative z-10",
                  isActive
                    ? `bg-gradient-to-br ${item.color} shadow-lg`
                    : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:" + item.color,
                )}
              >
                <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-white" : "text-gray-600")} />
              </div>
              <span className={cn("relative z-10", isActive ? "text-gray-900 font-semibold" : "text-gray-700")}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="text-xs text-center text-gray-500">
          <p className="font-medium">v1.0.0</p>
          <p className="mt-1">© 2025 Sree Sarojaa</p>
        </div>
      </div>
    </aside>
  )
}
