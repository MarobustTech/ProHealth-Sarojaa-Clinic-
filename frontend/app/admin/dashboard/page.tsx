"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Stethoscope,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  BarChart3
} from "lucide-react"
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

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      } else if (response.status === 401) {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const mainStats = [
    {
      title: "Total Doctors",
      value: stats?.totalDoctors || 0,
      active: stats?.activeDoctors || 0,
      icon: Users,
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Specializations",
      value: stats?.totalSpecializations || 0,
      active: stats?.activeSpecializations || 0,
      icon: Stethoscope,
      gradient: "from-purple-500 via-purple-600 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      change: "+5%",
      trend: "up"
    },
    {
      title: "Total Patients",
      value: stats?.totalPatients || 0,
      active: stats?.totalPatients || 0,
      icon: Activity,
      gradient: "from-emerald-500 via-teal-600 to-cyan-600",
      bgGradient: "from-emerald-50 to-cyan-50",
      change: "+23%",
      trend: "up"
    },
    {
      title: "Total Appointments",
      value: stats?.totalAppointments || 0,
      active: stats?.completedAppointments || 0,
      icon: Calendar,
      gradient: "from-orange-500 via-amber-600 to-yellow-600",
      bgGradient: "from-orange-50 to-yellow-50",
      change: "+18%",
      trend: "up"
    },
  ]

  const appointmentStats = [
    {
      title: "Pending",
      value: stats?.pendingAppointments || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200"
    },
    {
      title: "Confirmed",
      value: stats?.confirmedAppointments || 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200"
    },
    {
      title: "Completed",
      value: stats?.completedAppointments || 0,
      icon: CheckCircle2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200"
    },
  ]

  const quickActions = [
    {
      title: "View Doctors",
      description: "Manage doctor profiles",
      icon: Users,
      href: "/admin/dashboard/doctors",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "View Appointments",
      description: "Manage bookings",
      icon: Calendar,
      href: "/admin/dashboard/appointments",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Analytics",
      description: "View insights",
      icon: BarChart3,
      href: "/admin/dashboard/analytics",
      gradient: "from-emerald-500 to-teal-600"
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">System Online</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${stat.bgGradient}`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{stat.active} active</span>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <ArrowUpRight className="w-4 h-4" />
                      {stat.change}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Appointment Status Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Status</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {appointmentStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className={`border-2 ${stat.borderColor} hover:shadow-lg transition-all`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card
                key={index}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                onClick={() => router.push(action.href)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentAppointments && stats.recentAppointments.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentAppointments.slice(0, 5).map((apt, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 transition-all border border-gray-200 hover:border-blue-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {apt.patientName?.charAt(0) || "P"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{apt.patientName || "Patient"}</p>
                      <p className="text-sm text-gray-600">
                        {apt.doctorName || "Doctor"} • {apt.appointmentDate} at {apt.appointmentTime}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                    apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      apt.status === "completed" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                    }`}>
                    {apt.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
