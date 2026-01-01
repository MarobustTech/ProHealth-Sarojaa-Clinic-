"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, Calendar, TrendingUp, ShieldCheck } from "lucide-react"
import { getAdminToken } from "@/lib/admin-auth"
import { Loader2 } from "lucide-react"

interface DashboardStats {
  totalDoctors: number
  activeDoctors: number
  totalSpecializations: number
  activeSpecializations: number
  totalAppointments: number
  pendingAppointments: number
  confirmedAppointments: number
  completedAppointments: number
  totalPatients: number
  recentAppointments: any[]
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const token = getAdminToken()
      if (!token) {
        setLoading(false)
        return
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/stats`
      console.log("Fetching dashboard stats from:", apiUrl)
      console.log("Token present:", !!token, "Token length:", token?.length)
      console.log("Token preview:", token ? `${token.substring(0, 20)}...` : "None")
      
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      console.log("Dashboard stats response status:", response.status)
      
      if (!response.ok && response.status === 401) {
        const errorText = await response.text().catch(() => "Could not read error")
        console.error("401 Error Details:", errorText)
      }

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.stats) {
          setStats(data.stats)
        }
      } else if (response.status === 401) {
        // Don't clear token or redirect - just show 0 stats
        // User stays on page unless they explicitly log out
        console.warn("401 Unauthorized - Token may be invalid, but staying on page")
        setStats(null)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = stats ? [
    {
      title: "Total Doctors",
      value: stats.totalDoctors.toString(),
      icon: Users,
      trend: `${stats.activeDoctors} active`,
      color: "from-blue-600 via-cyan-500 to-teal-400",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Specializations",
      value: stats.totalSpecializations.toString(),
      icon: Stethoscope,
      trend: `${stats.activeSpecializations} active`,
      color: "from-purple-600 via-pink-500 to-rose-400",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments.toString(),
      icon: Calendar,
      trend: `${stats.confirmedAppointments} confirmed`,
      color: "from-teal-600 via-emerald-500 to-green-400",
      bgColor: "from-teal-50 to-emerald-50",
    },
    {
      title: "Total Bookings",
      value: stats.totalAppointments.toString(),
      icon: TrendingUp,
      trend: `${stats.completedAppointments} completed`,
      color: "from-orange-600 via-amber-500 to-yellow-400",
      bgColor: "from-orange-50 to-amber-50",
    },
  ] : [
    {
      title: "Total Doctors",
      value: "0",
      icon: Users,
      trend: "Loading...",
      color: "from-blue-600 via-cyan-500 to-teal-400",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Specializations",
      value: "0",
      icon: Stethoscope,
      trend: "Loading...",
      color: "from-purple-600 via-pink-500 to-rose-400",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      title: "Pending Appointments",
      value: "0",
      icon: Calendar,
      trend: "Loading...",
      color: "from-teal-600 via-emerald-500 to-green-400",
      bgColor: "from-teal-50 to-emerald-50",
    },
    {
      title: "Total Bookings",
      value: "0",
      icon: TrendingUp,
      trend: "Loading...",
      color: "from-orange-600 via-amber-500 to-yellow-400",
      bgColor: "from-orange-50 to-amber-50",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Monitor your hospital's key metrics and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card
            key={stat.title}
            className={`group border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br ${stat.bgColor} relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full blur-2xl" />
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <p className="text-xs text-gray-600 mt-2 font-medium">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : stats && stats.recentAppointments && stats.recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {stats.recentAppointments.slice(0, 5).map((apt: any) => {
                  const initials = apt.patientName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                  const statusColors: Record<string, string> = {
                    confirmed: "bg-green-100 text-green-700",
                    completed: "bg-blue-100 text-blue-700",
                    cancelled: "bg-red-100 text-red-700",
                    pending: "bg-yellow-100 text-yellow-700",
                  }
                  return (
                    <div key={apt.id} className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {initials}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {apt.patientName} - {apt.specialization}
                        </p>
                        <p className="text-sm text-gray-600">
                          {apt.appointmentDate} at {apt.appointmentTime}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[apt.status] || statusColors.pending}`}>
                        {apt.status}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No recent appointments</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => router.push("/admin/dashboard/doctors")}
                className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 border border-blue-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Add Doctor</span>
              </button>
              <button 
                onClick={() => router.push("/admin/dashboard/specializations")}
                className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 border border-purple-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Add Specialization</span>
              </button>
              <button 
                onClick={() => router.push("/admin/dashboard/appointments")}
                className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 border border-teal-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">View Bookings</span>
              </button>
              <button 
                onClick={() => router.push("/admin/dashboard")}
                className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 border border-orange-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">View Reports</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
