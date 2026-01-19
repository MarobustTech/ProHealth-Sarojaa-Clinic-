"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAdminToken } from "@/lib/admin-auth"
import { AnalyticsCharts } from "@/components/admin/analytics-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, BarChart3, PieChart, Calendar, ArrowUpRight } from "lucide-react"

export default function AnalyticsPage() {
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const token = getAdminToken()
            if (!token) {
                router.push("/admin/login")
                return
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/stats`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.ok) {
                const data = await response.json()
                setStats(data.stats)
            } else if (response.status === 401) {
                router.push("/admin/login")
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-500">Loading analytics...</p>
                </div>
            </div>
        )
    }

    const quickStats = [
        {
            title: "Total Appointments",
            value: stats?.totalAppointments || 0,
            icon: Calendar,
            gradient: "from-blue-500 to-indigo-600",
            bgGradient: "from-blue-50 to-indigo-50",
            change: "+12%"
        },
        {
            title: "Pending",
            value: stats?.pendingAppointments || 0,
            icon: TrendingUp,
            gradient: "from-yellow-500 to-orange-600",
            bgGradient: "from-yellow-50 to-orange-50",
            change: "+5%"
        },
        {
            title: "Confirmed",
            value: stats?.confirmedAppointments || 0,
            icon: BarChart3,
            gradient: "from-green-500 to-emerald-600",
            bgGradient: "from-green-50 to-emerald-50",
            change: "+18%"
        },
        {
            title: "Completed",
            value: stats?.completedAppointments || 0,
            icon: PieChart,
            gradient: "from-purple-500 to-pink-600",
            bgGradient: "from-purple-50 to-pink-50",
            change: "+23%"
        },
    ]

    return (
        <div className="space-y-8 p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Comprehensive insights and performance metrics
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-100">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Live Data</span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {quickStats.map((stat, index) => {
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
                                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                        <ArrowUpRight className="w-4 h-4" />
                                        {stat.change} from last month
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Analytics Charts */}
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Performance Insights</h2>
                    <p className="text-gray-600 mt-1">Detailed analytics and trends</p>
                </div>
                {stats && <AnalyticsCharts stats={stats} />}
            </div>
        </div>
    )
}
