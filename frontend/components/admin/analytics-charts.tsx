"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { getAdminToken } from "@/lib/admin-auth"
import axios from "axios"

interface AnalyticsChartsProps {
    stats: any
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
    const [analyticsData, setAnalyticsData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnalyticsData()
    }, [])

    const fetchAnalyticsData = async () => {
        try {
            const token = getAdminToken()
            if (!token) return

            const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/analytics`
            console.log("Fetching analytics (axios) from:", url)

            // Using axios to bypass browser extension 'fetch' wrappers
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token.trim()}`,
                    "Content-Type": "application/json"
                },
            })

            // Axio throws on non-2xx status, so we go straight to data
            setAnalyticsData(response.data.analytics)

        } catch (error) {
            console.error("Failed to fetch analytics:", error)
        } finally {
            setLoading(false)
        }
    }

    // Appointment Status Data
    const appointmentStatusData = [
        { name: "Pending", value: stats?.pendingAppointments || 0, color: "#FFBB28" },
        { name: "Confirmed", value: stats?.confirmedAppointments || 0, color: "#00C49F" },
        { name: "Completed", value: stats?.completedAppointments || 0, color: "#0088FE" },
        { name: "Cancelled", value: analyticsData?.cancelledAppointments || 0, color: "#FF8042" },
    ]

    // Use real-time data or fallback to empty
    const monthlyData = analyticsData?.monthlyData || []
    const doctorPerformanceData = analyticsData?.doctorPerformance || []
    const weeklyTrendData = analyticsData?.weeklyTrend || []

    if (loading) {
        return (
            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-2">
                        <CardHeader>
                            <CardTitle>Loading...</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] flex items-center justify-center text-gray-400">
                                Loading analytics data...
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Appointment Status Pie Chart */}
            <Card className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                        Appointment Status Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={appointmentStatusData.filter((item: any) => item.value > 0)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {appointmentStatusData.filter((item: any) => item.value > 0).map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                payload={appointmentStatusData.map((item: any, index: number) => ({
                                    value: item.name,
                                    type: 'circle',
                                    id: item.name,
                                    color: item.color
                                }))}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Monthly Appointments Trend */}
            <Card className="border-2 hover:border-purple-200 transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                        Monthly Appointments Trend (Last 6 Months)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="appointments"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ fill: "#8b5cf6", r: 6 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Doctor Performance */}
            <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                        Top Doctors by Appointments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={doctorPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="doctor" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="appointments" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Weekly Patient Trend */}
            <Card className="border-2 hover:border-orange-200 transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                        Weekly Patient Trend (Last 7 Days)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="patients" fill="#f59e0b" radius={[8, 8, 0, 0]}>
                                {weeklyTrendData.map((_entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
